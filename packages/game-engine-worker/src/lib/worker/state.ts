import { ReplaySubject } from 'rxjs';

export interface GameEngineWorker<R> {
    input$: ReplaySubject<R>;
    worker: Worker;
}
