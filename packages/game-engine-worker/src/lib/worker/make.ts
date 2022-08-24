import { from, Observable, ReplaySubject } from 'rxjs';
import { Stream } from 'xstream';
import { WorkerMessage } from '../message/state';
import { GameEngineWorker } from './state';

interface FeatureState {
    [key: string]: any;
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
