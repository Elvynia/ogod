import { last, Observable, Subject, takeUntil, tap } from 'rxjs';

export function makeRuntime$<S>(sink$: Observable<S>, state$: Subject<S>): Observable<S> {
    return sink$.pipe(
        takeUntil(state$.pipe(last())),
        tap((state) => state$.next(state))
    )
};
