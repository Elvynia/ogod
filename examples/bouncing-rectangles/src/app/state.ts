import { MainDOMSource } from '@cycle/dom';
import { GameBox2DSource } from '@ogod/game-box2d-driver';
import { GameEngineSource, GameEngineWorker } from '@ogod/game-core';
import { Rect } from './rectangle';

export interface ObjectState {
    [id: string]: Rect;
}

export interface AppReflectState {
    fps: number;
    objectCount: number;
    objects: Array<{
        id: string;
        x: number;
        y: number;
        angle: number;
        width: number;
        height: number;
        health: number;
    }>
}

export interface AppSources {
    GameWorker: GameEngineWorker<AppReflectState>;
    DOM: MainDOMSource;
}

export interface WorkerSources {
    GameEngine: GameEngineSource;
    World: GameBox2DSource;
}

export interface AppSize {
    width: number;
    height: number;
    scale: number;
}

export interface AppState {
    app: AppSize;
    fps: number;
    objects: ObjectState;
    paused: boolean;
    grounds: Rect[];
    player: Rect;
}

// FIXME: define this automatically in makeGameEngineOptions.
export interface AppActions {
    playerColor: string;
}
