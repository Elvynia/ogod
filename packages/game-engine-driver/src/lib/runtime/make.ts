import { FeatureState, RuntimeState } from '@ogod/game-core';
import { last, Observable, Subject, takeUntil, tap } from "rxjs";
import { Stream } from "xstream";
import { makeFeature } from "../feature/make";

export function makeRuntime$<S extends FeatureState>(sink$: Stream<RuntimeState<S>>, state$: Subject<S>): Observable<S> {
    return makeFeature(sink$ as any as Observable<RuntimeState<S>>).pipe(
        takeUntil(state$.pipe(last())),
        tap((state) => state$.next(state))
    )
};
