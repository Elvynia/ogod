import { WorkerMessage } from '@ogod/core';
import { AsyncSubject, Observable, ReplaySubject, Subject } from 'rxjs';

export interface GameWorkerSource<R> {
    initialized$: AsyncSubject<void>;
    input$: ReplaySubject<R>;
    worker: Worker;
}

export type GameWorkerSink = Observable<WorkerMessage>;
