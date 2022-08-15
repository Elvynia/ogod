import { BehaviorSubject, combineLatest, from, last, map, Observable, ReplaySubject, Subject, switchMap, takeUntil, tap } from "rxjs";
import { Stream } from "xstream";
import { RuntimeState } from '../runtime/state';
import { GameState } from './state';

export function makeGame<S extends GameState>(sink$: Stream<RuntimeState<S>>, state$: BehaviorSubject<S>): Observable<S> {
    return makeFeature(sink$ as any as Observable<RuntimeState<S>>).pipe(
        takeUntil(state$.pipe(last())),
        tap((state) => state$.next(state))
    )
};

export function makeFeature<F extends GameState>(runtime$: Observable<RuntimeState<F>>) {
    const subject = new ReplaySubject<F>(1);
    from(runtime$).pipe(
        switchMap((runtime) => {
            const keys = Object.keys(runtime).sort();
            return combineLatest(keys.map((k) => runtime[k])).pipe(
                map((slices) => keys.map((k, i) => ({ [k]: slices[i] }))
                    .reduce((state, slice) => Object.assign(state, slice), {} as F)
                )
            )
        })
    ).subscribe(subject);
    return subject;
}
