import { buffer, filter, map, ReplaySubject, Subject, withLatestFrom } from "rxjs";
import { Stream } from "xstream";
import { makeAction$ } from "../action/make";
import { FeatureState } from "../feature/state";
import { makeFrame$ } from '../frame/make';
import { makeRuntime$ } from "../runtime/make";
import { RuntimeState } from '../runtime/state';
import { GameEngineSource } from './state';

export function makeGameEngineDriver<S extends FeatureState>(initState: S, workerContext?: any, state$: Subject<S> = new ReplaySubject<S>(1)) {
    const action$ = makeAction$(initState);
    const frame$ = makeFrame$();
    if (workerContext) {
        state$.pipe(
            buffer(frame$),
            map((states) => states.pop()),
            filter((state) => !!state)
        ).subscribe((state) => workerContext.postMessage(state));
        workerContext.onmessage = (event: any) => action$.select(event.data.key).next(event.data.value);
    }
    return function gameEngineDriver(sinks: Stream<RuntimeState<S>>): GameEngineSource<S> {
        makeRuntime$(sinks, state$).subscribe(state$);
        state$.next(initState);
        return {
            action$,
            dispose: () => {
                console.log('Stopping game engine');
                state$.complete();
            },
            frame$,
            state$,
            render$: frame$.pipe(
                withLatestFrom(state$)
            )
        };
    };
}
