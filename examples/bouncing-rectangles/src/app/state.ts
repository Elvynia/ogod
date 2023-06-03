import { XY } from '@box2d/core';
import { MainDOMSource } from '@cycle/dom';
import { Contact, GameBox2dSink, GameBox2dSource } from '@ogod/driver-box2d';
import { GameEngineSink, GameEngineSource } from '@ogod/driver-engine';
import { GameWorkerSource } from '@ogod/driver-worker';
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
    GameWorker: GameWorkerSource<AppReflectState>;
    DOM: MainDOMSource;
}

export interface WorkerSources {
    GameEngine: GameEngineSource<AppState, ActionHandlers, number>;
    World: GameBox2dSource<HealthContact>;
}

export interface WorkerSinks {
    GameEngine: GameEngineSink<AppState, AppReflectState, number>;
    World: GameBox2dSink
}
