import { MainDOMSource } from '@cycle/dom';
import { GameBox2dSource } from '@ogod/game-box2d-driver';
import { GameEngineSource, GameEngineWorker } from '@ogod/game-core';
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
    objectCount: number;
    objects: Array<Omit<Rect, 'dynamic' | 'color' | 'body'>>;
};

export type AppAction = 'camera' | 'objects' | 'paused' | 'playerColor';

export interface AppSources {
    GameWorker: GameEngineWorker<AppReflectState>;
    DOM: MainDOMSource;
}

export interface WorkerSources {
    GameEngine: GameEngineSource<AppState, AppAction>;
    World: GameBox2dSource;
}
