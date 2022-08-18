import { ReplaySubject, Subject } from 'rxjs';

export interface FeatureState {
    [key: string]: any;
}

export interface WorkerAction {
    key: string;
    value?: any;
}

export type WorkerMessage = [WorkerAction, any[]?];

export interface GameEngineWorker<S extends FeatureState> {
    input$: ReplaySubject<S>;
    output$: Subject<WorkerMessage>; // FIXME: Should be sinks observable
    worker: Worker;
}

export function makeGameEngineWorker<S extends FeatureState>(worker: Worker): () => GameEngineWorker<S> {
    return () => {
        const input$ = new ReplaySubject<S>(1);
        const output$ = new Subject<WorkerMessage>();
        worker.onmessage = (event) => input$.next(event.data);
        output$.subscribe((args: any[]) => worker.postMessage(args[0], args[1]));
        return {
            input$,
            output$,
            worker
        };
    };
}
