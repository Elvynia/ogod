import { WorkerMessage } from '@ogod/core';
import { EngineSink, EngineSource } from '@ogod/driver-engine';
import { WorkerSource } from '@ogod/driver-worker';
import { Subject } from 'rxjs';
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
    Worker: WorkerSource<AppReflectState>;
    Element: Subject<WorkerMessage>;
}
export const ActionKeys = ['camera', 'generator', 'scale', 'offset'] as const;
export type AppAction = typeof ActionKeys[number];

export class ActionHandlers {
    constructor(
        public generator?: GeneratorType,
        public scale?: number,
        public offset?: number
    ) { }
}

export interface WorkerSources {
    Engine: EngineSource<AppState, ActionHandlers>;
}

export interface WorkerSinks {
    Engine: EngineSink<AppState, AppReflectState>;
}
