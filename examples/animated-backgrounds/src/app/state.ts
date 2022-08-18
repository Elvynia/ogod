import { GameEngineWorker } from '@ogod/game-engine-worker';
import { BallState } from './ball';

export interface AppState {
    app: { width: number, height: number };
    objects: BallState;
}

export interface AppSources {
    GameWorker: GameEngineWorker<AppState>;
}

export const initState = {
    app: {
        width: 800,
        height: 600
    },
    objects: {}
};
