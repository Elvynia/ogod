import { WorkerMessage } from '@ogod/game-core';
import { GameEngineSink, GameEngineSource } from '@ogod/game-engine-driver';
import { GameWorkerSource } from '@ogod/game-worker-driver';
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
    GameWorker: GameWorkerSource<AppReflectState>;
    ElementHost: Subject<WorkerMessage>;
}
export const ActionKeys = ['camera', 'generator', 'scale', 'offset'];
export type AppAction = typeof ActionKeys[number];

export interface WorkerSources {
    GameEngine: GameEngineSource<AppState, AppAction>;
}

export interface WorkerSinks {
    GameEngine: GameEngineSink<AppState, AppReflectState>;
}
