import { GameEngineWorker, WorkerMessage } from '@ogod/game-core';
import { Subject } from 'rxjs';
import { BallState } from './ball';

export interface AppState {
    app: { width: number, height: number };
    objects: BallState;
}

export interface AppActions {
    reset: void;
    objects: { x: number, y: number};
}

export interface AppSources {
    GameWorker: GameEngineWorker<AppState>;
    ElementHost: Subject<WorkerMessage>;
}
