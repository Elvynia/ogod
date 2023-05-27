import { Observable, Observer, Subscriber, mergeMap, startWith, switchMap } from "rxjs";
import { FeatureGroup, FeatureKey, FeatureObject, FeatureProperty, isFeatureKey } from "../feature/state";

export function makeObserverProperty<T extends object, V>(
    assign: (value: V) => void,
    feature: FeatureProperty<T>,
    remove: () => void,
    subscriber: Subscriber<T>
): Observer<V> {
    const observer = {} as Observer<V>;
    if (feature.value) {
        // FIXME: NonNullable not applied to Partial<T> ?
        assign(feature.value as V);
        if (feature.publishOnCreate) {
            subscriber.next(feature.state);
        }
    }
    if (feature.publishOnNext) {
        observer.next = (value) => {
            assign(value);
            subscriber.next(feature.state);
        };
    } else {
        observer.next = assign;
    }
    if (feature.publishOnComplete) {
        observer.complete = () => {
            remove();
            subscriber.next(feature.state);
            subscriber.complete();
        };
    } else {
        observer.complete = () => subscriber.complete();
    }
    return observer;
}

export function makeObserverGroup<T extends object>(
    feature: FeatureGroup<T> & { state: T },
    subscriber: Subscriber<T>
): Observer<Partial<T>> {
    return makeObserverProperty(
        (value) => Object.assign(feature.state, value),
        feature,
        () => feature.publishOnComplete ? feature.keys.forEach((k) => delete feature.state[k]) : undefined,
        subscriber
    );
}

export function makeObserverKey<T extends object, K extends keyof T = keyof T>(
    feature: FeatureKey<T> & { state: T },
    subscriber: Subscriber<T>
): Observer<T[K]> {
    return makeObserverProperty(
        (value) => feature.state[feature.key] = value,
        feature,
        () => delete feature.state[feature.key],
        subscriber
    );
}

export function makeStateProperty<T extends object>(feature: FeatureProperty<T>): Observable<T> {
    return new Observable<T>((subscriber) => {
        const sub = isFeatureKey(feature)
            ? feature.value$.subscribe(makeObserverKey(feature, subscriber))
            : feature.value$.subscribe(makeObserverGroup(feature, subscriber));
        return () => sub.unsubscribe();
    });
}

export function makeStateObject<T extends object>(feature: FeatureObject<T>): Observable<T> {
    let makeKey$ = (state: T) => {
        let source$ = feature.key$.pipe(
            mergeMap((featureKey) => {
                return makeStateProperty<T>({
                    ...featureKey,
                    state
                })
            })
        );
        if (feature.publishOnCreate) {
            source$ = source$.pipe(
                startWith(state)
            );
        }
        return source$;
    };
    if (feature.state instanceof Observable) {
        return feature.state.pipe(
            switchMap((state) => makeKey$(state))
        )
    } else {
        return makeKey$(feature.state);
    }
}
