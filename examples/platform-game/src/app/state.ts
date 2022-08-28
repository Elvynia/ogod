import { MainDOMSource } from '@cycle/dom';
import { GameBox2DSource } from '@ogod/game-box2d-driver';
import { GameEngineSource, GameEngineWorker } from '@ogod/game-core';
import { Camera } from './camera/state';
import { Controls } from './controls/state';
import { LoadingState } from './loading/state';
import { MapState } from './map/state';
import { Shapes } from './shape/state';

export interface AppReflectState {
    fps: number;
    loading: LoadingState;
}

export interface AppSources {
    GameWorker: GameEngineWorker<AppReflectState>;
    DOM: MainDOMSource;
}

export interface AppState {
    camera: Camera;
    fps: number;
    shapes: Shapes;
    controls: Controls<any>;
    gameMap: MapState;
    loading?: LoadingState;
}

export interface AppActions {
}

export interface WorkerSources {
    GameEngine: GameEngineSource<AppState, AppActions>;
    World: GameBox2DSource;
}
