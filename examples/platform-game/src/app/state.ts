import { MainDOMSource } from '@cycle/dom';
import { GameBox2DSource } from '@ogod/game-box2d-driver';
import { GameEngineSource, GameEngineWorker } from '@ogod/game-core';
import { Controls } from './controls/state';
import { Shapes } from './shape/state';

export interface AppReflectState {
    fps: number;
}

export interface AppSources {
    GameWorker: GameEngineWorker<AppReflectState>;
    DOM: MainDOMSource;
}

export interface AppSize {
    width: number;
    height: number;
    scale: number;
}

export interface AppState {
    app: AppSize;
    fps: number;
    shapes: Shapes;
    controls: Controls;
}

export interface AppActions {
}

export interface WorkerSources {
    GameEngine: GameEngineSource<AppState, AppActions>;
    World: GameBox2DSource;
}
