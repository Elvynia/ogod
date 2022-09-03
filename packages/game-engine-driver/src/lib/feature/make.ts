import { ComplexFeature, Feature, FeatureState, isComplexFeature } from '@ogod/game-core';
import { concat, concatMap, map, merge, mergeMap, Observable, of, shareReplay, startWith, tap } from 'rxjs';

export function makeFeatureConstant<K extends string, T>(key: K, value: T): Feature<K, T> {
    return {
        key,
        value
    }
}

export function makeFeatureObservable<K extends string, T>(key: K, value$: Observable<T>, value?: T, remove: boolean = true): Feature<K, T> {
    return {
        key,
        value,
        value$,
        remove
    }
}

export function makeFeatureComplex(value$: Observable<Feature[]>, mapper = concatMap): ComplexFeature {
    return {
        value$,
        mapper
    }
}

export function makeFeatureBasic$(feature: Feature, state: any) {
    let f$;
    if (feature.value$) {
        f$ = feature.value$;
        if (feature.value !== undefined) {
            f$ = f$.pipe(
                startWith(feature.value)
            );
        }
    } else {
        f$ = of(feature.value);
    }
    f$ = f$.pipe(
        map((value) => {
            state[feature.key] = value;
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

export function makeFeatureComplex$<K extends string>(feature: ComplexFeature<K>, state: FeatureState<K>): Observable<FeatureState<K>> {
    return feature.value$.pipe(
        feature.mapper((features) => merge(...features.map((f) => makeFeatureBasic$(f, state))))
    ) as Observable<FeatureState<K>>;
}

export function makeFeature$<K extends string>(sink$: Observable<Feature<K> | ComplexFeature<K>>, mapper = mergeMap): Observable<FeatureState<K>> {
    const state: FeatureState<K> = {} as FeatureState<K>;
    return sink$.pipe(
        mapper((feature) => {
            let f$: Observable<FeatureState<K>>;
            if (isComplexFeature(feature)) {
                f$ = makeFeatureComplex$(feature, state);
            } else {
                f$ = makeFeatureBasic$(feature, state);
            }
            return f$;
        }),
        shareReplay(1)
    )
}
