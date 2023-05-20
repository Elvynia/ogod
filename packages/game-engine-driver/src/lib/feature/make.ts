import { Observable, Observer, Subscriber, mergeMap, switchMap } from "rxjs";
import { FeatureGroup, FeatureKey, FeatureObject, FeatureProperty, isFeatureKey } from "./state";

export function makeFeaturePropertyObserver<T extends object, V>(
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

export function makeFeatureGroupObserver<T extends object>(
    feature: FeatureGroup<T> & { state: T },
    subscriber: Subscriber<T>
): Observer<Partial<T>> {
    return makeFeaturePropertyObserver(
        (value) => Object.assign(feature.state, value),
        feature,
        () => feature.publishOnComplete ? feature.keys.forEach((k) => delete feature.state[k]) : undefined,
        subscriber
    );
}

export function makeFeatureKeyObserver<T extends object, K extends keyof T = keyof T>(
    feature: FeatureKey<T> & { state: T },
    subscriber: Subscriber<T>
): Observer<T[K]> {
    return makeFeaturePropertyObserver(
        (value) => feature.state[feature.key] = value,
        feature,
        () => delete feature.state[feature.key],
        subscriber
    );
}

export function makeFeatureProperty$<T extends object>(feature: FeatureProperty<T>): Observable<T> {
    return new Observable<T>((subscriber) => {
        const sub = isFeatureKey(feature)
            ? feature.value$.subscribe(makeFeatureKeyObserver(feature, subscriber))
            : feature.value$.subscribe(makeFeatureGroupObserver(feature, subscriber));
        return () => sub.unsubscribe();
    });
}

export function makeFeatureObject$<T extends object>(feature: FeatureObject<T>): Observable<T> {
    return feature.state$.pipe(
        switchMap((state) => feature.key$.pipe(
            mergeMap((featureKey) => {
                return makeFeatureProperty$<T>({
                    ...featureKey,
                    state
                })
            })
        ))
    )
}
