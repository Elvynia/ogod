import { BehaviorSubject, last, Observable, takeUntil, tap } from "rxjs";
import { Stream } from "xstream";
import { makeFeature } from "../feature/make";
import { FeatureState } from '../feature/state';
import { RuntimeState } from '../runtime/state';

export function makeGame<S extends FeatureState>(sink$: Stream<RuntimeState<S>>, state$: BehaviorSubject<S>): Observable<S> {
    return makeFeature(sink$ as any as Observable<RuntimeState<S>>).pipe(
        takeUntil(state$.pipe(last())),
        tap((state) => state$.next(state))
    )
};
