import { MainDOMSource } from '@cycle/dom';
import { GameBox2dSink, GameBox2dSource } from '@ogod/game-box2d-driver';
import { GameEngineSink, GameEngineSource } from '@ogod/game-engine-driver';
import { GameWorkerSource } from '@ogod/game-worker-driver';
import { Background } from './background/state';
import { Camera } from './camera/state';
import { Controls } from './controls/state';
import { LoadingState } from './loading/state';
import { MapState } from './map/state';
import { Shapes } from './shape/state';
import { Sleet } from './sleet/state';

export type AppReflectState = Pick<AppState, 'phase' | 'loading' | 'fps' | 'paused'>
    & Pick<MapState, 'level' | 'gravity'>
    & Pick<Background, 'baseColor'>;

export interface AppSources {
    GameWorker: GameWorkerSource<AppReflectState>;
    DOM: MainDOMSource;
}

export interface AppState {
    background: Background;
    camera: Camera;
    controls?: Controls<any>;
    fps: number;
    gmap: MapState;
    loading?: LoadingState;
    paused: boolean;
    phase: number;
    shapes: Shapes;
    splash?: Record<string, Sleet>;
}

export const ActionKeys = ['camera', 'controls', 'phase', 'paused', 'gravity', 'background'];
export type AppAction = typeof ActionKeys[number];

export interface WorkerSources {
    GameEngine: GameEngineSource<AppState, AppAction>;
    World: GameBox2dSource;
}

export interface WorkerSinks {
    GameEngine: GameEngineSink<AppState, AppReflectState>;
    World: GameBox2dSink;
}
