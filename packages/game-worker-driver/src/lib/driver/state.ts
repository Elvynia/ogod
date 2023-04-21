import { WorkerMessage } from '@ogod/game-core';
import { AsyncSubject, Observable, ReplaySubject } from 'rxjs';

export interface GameWorkerSource<R> {
    initialized$: AsyncSubject<void>;
    input$: ReplaySubject<R>;
    worker: Worker;
}

export type GameWorkerSink = Observable<WorkerMessage>;