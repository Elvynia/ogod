import { Feature, FeatureState } from '@ogod/game-core';
import { last, Observable, Subject, takeUntil, tap } from 'rxjs';
import { makeFeature$ } from '../feature/make';

export function makeRuntime$<F extends Feature>(sink$: Observable<F>, state$: Subject<FeatureState<F>>): Observable<FeatureState<F>> {
    return makeFeature$(sink$).pipe(
        takeUntil(state$.pipe(last())),
        tap((state) => state$.next(state))
    )
};
