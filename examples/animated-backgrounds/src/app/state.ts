import { GameEngineSink, GameEngineSource, GameEngineWorker, WorkerMessage } from '@ogod/game-core';
import { Subject } from 'rxjs';
import { Camera } from './camera/state';
import { ObjectState } from './object/state';

export interface AppState {
    camera: Camera;
    objects: ObjectState;
}

export interface AppReflectState {
    objects: number;
}

export interface AppSources {
    GameWorker: GameEngineWorker<AppReflectState>;
    ElementHost: Subject<WorkerMessage>;
}

export type AppAction = 'camera' | 'objects' | 'reset';

export interface WorkerSources {
    GameEngine: GameEngineSource<AppState, AppAction>;
}

export interface WorkerSinks {
    GameEngine: GameEngineSink<AppState, AppReflectState>;
}
