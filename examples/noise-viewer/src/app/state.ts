import { GameEngineSink, GameEngineSource, GameEngineWorker, WorkerMessage } from '@ogod/game-core';
import { Subject } from 'rxjs';

export interface AppState {
    generator: () => (x: number, y: number) => number;
    scale: number;
    offset: () => number;
    data: ImageData;
}

export interface AppReflectState {
}

export interface AppSources {
    GameWorker: GameEngineWorker<AppReflectState>;
    ElementHost: Subject<WorkerMessage>;
}

export type AppAction = 'camera' | 'generator' | 'scale' | 'offset';

export interface WorkerSources {
    GameEngine: GameEngineSource<AppState, AppAction>;
}

export interface WorkerSinks {
    GameEngine: GameEngineSink<AppState, AppReflectState>;
}
