import { Feature, FeatureArray, isFeatureArray } from '@ogod/game-core';
import { concat, map, merge, mergeMap, Observable, of, shareReplay, startWith, tap } from 'rxjs';

export function makeFeatureConstant<S = any, K extends keyof S = keyof S, T = S[K]>(key: K, value: T): Feature<S, K, T> {
    return {
        key,
        value
    }
}

export function makeFeatureObservable<S = any, K extends keyof S = keyof S, T = S[K]>(key: K, value$: Observable<T>,
    value?: T, remove: boolean = true): Feature<S, K, T> {
    return {
        key,
        value,
        value$,
        remove
    }
}

export function makeFeatureArray<K extends string>(values: Feature<K>[], factory$ = merge): FeatureArray<K> {
    return {
        values,
        factory$
    }
}

export function makeFeatureBasic$<S>(feature: Feature<S>, state: S): Observable<S> {
    let f$;
    if (feature.value$) {
        f$ = feature.value$;
        if (feature.value !== undefined) {
            f$ = f$.pipe(
                startWith(feature.value)
            );
        }
    } else if (feature.value !== undefined) {
        f$ = of(feature.value);
    } else {
        throw new Error('Cannot make basic feature for key ' + (feature.key as string) + ': value and value$ properties are not defined')
    }
    f$ = f$.pipe(
        map((value) => {
            state[feature.key] = value as any;
            // TODO: use immutable to alter state.
            return state;
        })
    );
    if (feature.remove) {
        f$ = concat(
            f$,
            of(state).pipe(
                tap(() => delete state[feature.key])
            )
        );
    }
    return f$;
}

export function makeFeatureArray$<S>(feature: FeatureArray<S>, state: S): Observable<S> {
    return feature.factory$(...feature.values.map((f) => makeFeatureBasic$(f, state)));
}

export function makeFeature$<S>(feature$: Observable<Feature<S> | FeatureArray<S>>,
    state: S = {} as S, mapper = mergeMap): Observable<S> {
    return feature$.pipe(
        mapper((feature) => {
            let f$: Observable<S>;
            if (isFeatureArray(feature)) {
                f$ = makeFeatureArray$(feature, state);
            } else {
                f$ = makeFeatureBasic$(feature as Feature<S>, state);
            }
            return f$;
        }),
        shareReplay(1)
    )
}
