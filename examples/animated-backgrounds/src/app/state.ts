import { Subject } from 'rxjs';
import { GameEngineWorker, WorkerMessage } from '@ogod/game-engine-worker';
import { BallState } from './ball';

export interface AppState {
    app: { width: number, height: number };
    objects: BallState;
}

export interface AppSources {
    GameWorker: GameEngineWorker<AppState>;
    ElementHost: Subject<WorkerMessage>;
}

export const initState = {
    app: {
        width: 800,
        height: 600
    },
    objects: {}
};
