import { XY } from '@box2d/core';
import { Box2dSink, Box2dSource, Contact } from '@ogod/driver-box2d';
import { EngineSink, EngineSource } from '@ogod/driver-engine';
import { WorkerSource } from '@ogod/driver-worker';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { ObjectState } from './object/state';
import { Rect } from './rect/state';

export interface AppState {
    fps: number;
    grounds: Rect[];
    objects: ObjectState;
    paused: boolean;
    player: Rect;
    scale: number;
}

export type AppReflectState = Pick<AppState, 'fps'> & {
    objects: Array<Omit<Rect, 'id' | 'dynamic' | 'color' | 'body'>>;
    box2dCount: number;
};

export class ActionHandlers {
    constructor(
        public objects?: XY,
        public paused?: boolean,
        public playerColor = new ReplaySubject<string>(1)
    ) { }
}

export type HealthContact = Contact<BehaviorSubject<number>>;

export interface AppSources {
    Worker: WorkerSource<AppReflectState>;
}

export interface WorkerSources {
    Engine: EngineSource<AppState, ActionHandlers>;
    World: Box2dSource<HealthContact>;
}

export interface WorkerSinks {
    Engine: EngineSink<AppState, AppReflectState>;
    World: Box2dSink
}
