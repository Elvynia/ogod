import { BehaviorSubject, buffer, filter, map, ReplaySubject, Subject, withLatestFrom } from "rxjs";
import { Stream } from "xstream";
import { makeAction$ } from "../action/make";
import { WorkerMessage } from '../action/state';
import { FeatureState } from "../feature/state";
import { makeFrame$ } from '../frame/make';
import { makeRuntime$ } from "../runtime/make";
import { RuntimeState } from '../runtime/state';
import { GameEngineSource, GameEngineWorker } from './state';

export function makeGameEngineDriver<S extends FeatureState>(initState: S, workerContext?: any) {
    const action$ = makeAction$(initState);
    const state$ = new BehaviorSubject<S>(initState);
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

export function makeGameEngineWorker<S extends FeatureState>(worker: Worker): () => GameEngineWorker<S> {
    return () => {
        const input$ = new ReplaySubject<S>(1);
        const output$ = new Subject<WorkerMessage>();
        worker.onmessage = (event) => input$.next(event.data);
        output$.subscribe((args: any[]) => worker.postMessage(args[0], args[1]));
        return {
            input$,
            output$
        };
    };
}
