import { Driver, WorkerMessage } from '@ogod/core';
import { AsyncSubject, Observable, ReplaySubject } from 'rxjs';

export interface WorkerSource<R> {
    initialized$: AsyncSubject<void>;
    input$: ReplaySubject<R>;
    worker: Worker;
}

export type WorkerSink = Observable<WorkerMessage>;

export type DriverWorker<
    R = any,
> = Driver<WorkerSink, WorkerSource<R>>;
