import { GameEngineSource, GameEngineWorker, WorkerMessage } from '@ogod/game-core';
import { Subject } from 'rxjs';
import { BallState } from './ball';

export interface Screen {
    width: number;
    height: number;
}

export interface AppState {
    screen: Screen;
    objects: BallState;
}

export interface AppReflectState {
    objects: number;
}

export interface AppSources {
    GameWorker: GameEngineWorker<AppReflectState>;
    ElementHost: Subject<WorkerMessage>;
}

export interface WorkerSources {
    GameEngine: GameEngineSource<AppState, 'screen' | 'objects' | 'reset'>;
}
