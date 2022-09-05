import { GameEngineSink, GameEngineSource, GameEngineWorker, WorkerMessage } from '@ogod/game-core';
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

export type AppAction = 'screen' | 'objects' | 'reset';

export interface WorkerSources {
    GameEngine: GameEngineSource<AppState, AppAction>;
}

export interface WorkerSinks {
    GameEngine: GameEngineSink<AppState, AppReflectState>;
}
