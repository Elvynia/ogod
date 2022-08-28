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
        if (feature.value) {
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
            return { ...state };
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

export function makeFeatureComplex$<F extends Feature>(feature: ComplexFeature, state: FeatureState<F>): Observable<FeatureState<F>> {
    return feature.value$.pipe(
        feature.mapper((features) => merge(...features.map((f) => makeFeatureBasic$(f, state))))
    ) as Observable<FeatureState<F>>;
}

export function makeFeature$<F extends Feature>(sink$: Observable<F>, mapper = mergeMap): Observable<FeatureState<F>> {
    const state: FeatureState<F> = {};
    return sink$.pipe(
        mapper((feature) => {
            let f$: Observable<FeatureState<F>>;
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
