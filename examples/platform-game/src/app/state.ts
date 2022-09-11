import { MainDOMSource } from '@cycle/dom';
import { GameBox2dSource } from '@ogod/game-box2d-driver';
import { GameEngineSource, GameEngineWorker } from '@ogod/game-core';
import { Background } from './background/state';
import { Camera } from './camera/state';
import { Controls } from './controls/state';
import { LoadingState } from './loading/state';
import { MapState } from './map/state';
import { Shapes } from './shape/state';
import { Sleet } from './sleet/state';

export type AppReflectState = Pick<AppState, 'loading' | 'loaded' | 'fps' | 'paused'>

export interface AppSources {
    GameWorker: GameEngineWorker<AppReflectState>;
    DOM: MainDOMSource;
}

export interface AppState {
    background: Background;
    splash: {
        [id: string]: Sleet;
    };
    camera: Camera;
    fps: number;
    shapes: Shapes;
    controls: Controls<any>;
    gmap: MapState;
    loading?: LoadingState;
    paused: boolean;
    loaded?: boolean;
    start?: boolean;
}

export type AppAction = 'camera' | 'controls' | 'start' | 'paused' | 'gravity' | 'background';

export interface WorkerSources {
    GameEngine: GameEngineSource<AppState, AppAction>;
    World: GameBox2dSource;
}
