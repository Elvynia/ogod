import { from, Observable, ReplaySubject } from 'rxjs';
import { Stream } from 'xstream';

export interface FeatureState {
    [key: string]: any;
}

export interface WorkerAction {
    key: string;
    value?: any;
}

export type WorkerMessage = [WorkerAction, StructuredSerializeOptions?];

export interface GameEngineWorker<R> {
    input$: ReplaySubject<R>;
    worker: Worker;
}

export function makeGameEngineWorker<S extends FeatureState>(worker: Worker): (sinks$: Stream<WorkerMessage>) => GameEngineWorker<S> {
    return (sink$: Stream<WorkerMessage>) => {
        const input$ = new ReplaySubject<S>(1);
        const sub = from(sink$ as any as Observable<WorkerMessage>)
            .subscribe((args: WorkerMessage) => worker.postMessage(args[0], args[1]));;
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
