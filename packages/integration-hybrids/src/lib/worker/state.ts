import { WorkerMessage } from '@ogod/core';
import { AsyncSubject, ReplaySubject, Subject } from "rxjs";

export interface HybridWorker<T> {
    initialized$: AsyncSubject<void>;
    input$: ReplaySubject<T>;
    output$: Subject<WorkerMessage>;
}
