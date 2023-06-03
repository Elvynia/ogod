import { WorkerMessage } from '@ogod/core';
import { GameEngineSink, GameEngineSource } from '@ogod/driver-engine';
import { GameWorkerSource } from '@ogod/driver-worker';
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
    GameWorker: GameWorkerSource<AppReflectState>;
    ElementHost: Subject<WorkerMessage>;
}

export class ActionHandlers {
    constructor(
        public camera?: Camera,
        public objects?: { x: number, y: number },
        public reset?: void
    ) { }
}

export interface WorkerSources {
    GameEngine: GameEngineSource<AppState, ActionHandlers>;
}

export interface WorkerSinks {
    GameEngine: GameEngineSink<AppState, AppReflectState>;
}
