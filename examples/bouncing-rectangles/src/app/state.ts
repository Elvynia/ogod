import { XY } from '@box2d/core';
import { MainDOMSource } from '@cycle/dom';
import { Box2dSink, Box2dSource, Contact } from '@ogod/driver-box2d';
import { EngineSink, EngineSource } from '@ogod/driver-engine';
import { WorkerSource } from '@ogod/driver-worker';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { Camera } from './camera/state';
import { ObjectState } from './object/state';
import { Rect } from './rect/state';

export interface AppState {
    camera: Camera;
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
        public camera?: Camera,
        public objects?: XY,
        public paused?: boolean,
        public playerColor = new ReplaySubject<string>(1)
    ) { }
}

export type HealthContact = Contact<BehaviorSubject<number>>;

export interface AppSources {
    Worker: WorkerSource<AppReflectState>;
    DOM: MainDOMSource;
}

export interface WorkerSources {
    Engine: EngineSource<AppState, ActionHandlers>;
    World: Box2dSource<HealthContact>;
}

export interface WorkerSinks {
    Engine: EngineSink<AppState, AppReflectState>;
    World: Box2dSink
}
