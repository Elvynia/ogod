import { FeatureState, RuntimeState } from '@ogod/game-core';
import { last, Observable, Subject, takeUntil, tap } from "rxjs";
import { makeFeature } from "../feature/make";

export function makeRuntime$<S extends FeatureState>(sink$: Observable<RuntimeState<S>>, state$: Subject<S>): Observable<S> {
    return makeFeature(sink$).pipe(
        takeUntil(state$.pipe(last())),
        tap((state) => state$.next(state))
    )
};
