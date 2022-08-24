import { FeatureState, GameEngineWorker, WorkerMessage } from '@ogod/game-core';
import { from, Observable, ReplaySubject } from 'rxjs';
import { Stream } from 'xstream';

export function makeGameEngineWorker<S extends FeatureState>(worker: Worker): (sinks$: Stream<WorkerMessage>) => GameEngineWorker<S> {
    return (sink$: Stream<WorkerMessage>) => {
        const input$ = new ReplaySubject<S>(1);
        const sub = from(sink$ as any as Observable<WorkerMessage>)
            .subscribe((args: WorkerMessage) => worker.postMessage(args[0], args[1] as any));
        worker.onmessage = (event) => input$.next(event.data);
        return {
            input$,
            worker,
            dispose: () => {
                input$.complete();
                sub.unsubscribe();
            }
        };
    };
}
