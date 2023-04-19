import { MainDOMSource } from '@cycle/dom';
import { GameBox2dSink, GameBox2dSource } from '@ogod/game-box2d-driver';
import { GameEngineSink, GameEngineSource } from '@ogod/game-engine-driver';
import { GameWorkerSource } from '@ogod/game-worker-driver';
import { ObjectState } from './object/state';
import { Rect } from './rect';
import { Camera } from './screen/state';

export interface AppState {
    camera: Camera;
    fps: number;
    objects: ObjectState;
    paused: boolean;
    grounds: Rect[];
    player: Rect;
}

export type AppReflectState = Pick<AppState, 'fps'> & {
    objects: Array<Omit<Rect, 'dynamic' | 'color' | 'body'>>;
};

export const ActionKeys = ['camera', 'objects', 'paused', 'playerColor'] as const;
export type AppAction = typeof ActionKeys[number];

export interface AppSources {
    GameWorker: GameWorkerSource<AppReflectState>;
    DOM: MainDOMSource;
}

export interface WorkerSources {
    GameEngine: GameEngineSource<AppState, AppAction>;
    World: GameBox2dSource;
}

export interface WorkerSinks {
    GameEngine: GameEngineSink<AppState, AppReflectState>;
    World: GameBox2dSink
}
