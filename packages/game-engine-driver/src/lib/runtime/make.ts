import { ComplexFeature, Feature, FeatureState } from '@ogod/game-core';
import { last, Observable, Subject, takeUntil, tap } from 'rxjs';
import { makeFeature$ } from '../feature/make';

export function makeRuntime$<K extends string>(sink$: Observable<Feature<K> | ComplexFeature<K>>, state$: Subject<FeatureState<K>>): Observable<FeatureState<K>> {
    return makeFeature$(sink$).pipe(
        takeUntil(state$.pipe(last())),
        tap((state) => state$.next(state))
    )
};
