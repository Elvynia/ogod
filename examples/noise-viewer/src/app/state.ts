import { GameEngineSink, GameEngineSource, GameEngineWorker } from '@ogod/game-core';
import { NoiseSource, NoiseView } from './noises/state';

export interface XY {
    x: number;
    y: number;
}

export interface AppState {
    noises: NoiseView[];
    sources: NoiseSource[];
}

export interface AppReflectState {
}

export interface AppSources {
    GameWorker: GameEngineWorker<AppReflectState>;
    // ElementHost: Subject<WorkerMessage>;
}

export type AppAction = 'camera';

export interface WorkerSources {
    GameEngine: GameEngineSource<AppState, AppAction>;
}

export interface WorkerSinks {
    GameEngine: GameEngineSink<AppState, AppReflectState>;
}
