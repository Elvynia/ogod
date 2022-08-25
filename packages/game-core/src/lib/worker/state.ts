import { AsyncSubject, ReplaySubject } from 'rxjs';

export interface GameEngineWorker<R> {
    initialized$: AsyncSubject<void>;
    input$: ReplaySubject<R>;
    worker: Worker;
}
