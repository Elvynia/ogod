import { WorkerMessage } from '@ogod/core';
import { GameEngineSink, GameEngineSource } from '@ogod/driver-engine';
import { GameWorkerSource } from '@ogod/driver-worker';
import { Subject } from 'rxjs';
import { Camera } from './camera/state';
import { GeneratorType } from './generator/state';

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
export const ActionKeys = ['camera', 'generator', 'scale', 'offset'] as const;
export type AppAction = typeof ActionKeys[number];

export class ActionHandlers {
    constructor(
        public camera?: Camera,
        public generator?: GeneratorType,
        public scale?: number,
        public offset?: number
    ) { }
}

export interface WorkerSources {
    GameEngine: GameEngineSource<AppState, ActionHandlers>;
}

export interface WorkerSinks {
    GameEngine: GameEngineSink<AppState, AppReflectState>;
}
