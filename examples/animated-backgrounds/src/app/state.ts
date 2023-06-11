import { EngineSink, EngineSource } from '@ogod/driver-engine';
import { ObjectState } from './object/state';

export interface AppState {
    objects: ObjectState;
}

export interface AppReflectState {
    objects: number;
}

export class ActionHandlers {
    constructor(
        public objects?: { x: number, y: number },
        public reset?: void
    ) { }
}

export interface WorkerSources {
    Engine: EngineSource<AppState, ActionHandlers>;
}

export interface WorkerSinks {
    Engine: EngineSink<AppState, AppReflectState>;
}
