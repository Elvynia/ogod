import { MainDOMSource } from '@cycle/dom';
import { Contact, GameBox2dSink, GameBox2dSource } from '@ogod/driver-box2d';
import { FeatureKey, GameEngineSink, GameEngineSource } from '@ogod/driver-engine';
import { GameWorkerSource } from '@ogod/driver-worker';
import { Background } from './background/state';
import { Camera } from './camera/state';
import { Controls } from './controls/state';
import { LoadingState } from './loading/state';
import { MapState } from './map/state';
import { PHASE } from './phase/state';
import { Shapes } from './shape/state';
import { SplashState } from './splash/state';

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
    controls?: Controls<any>; // FIXME: Add control type !
    fps: number;
    loading: LoadingState;
    map: MapState;
    paused: boolean;
    phase: PHASE;
    shapes: Shapes;
    splash?: SplashState;
}

export class ActionHandlers {
    constructor(
        public background?: string,
        public camera?: Camera,
        public controls?: any,
        public gravity?: number,
        public loading?: FeatureKey<LoadingState, string>,
        public paused?: boolean,
        public phase?: number
    ) { }
}

export interface WorkerSources {
    GameEngine: GameEngineSource<AppState, ActionHandlers>;
    World: GameBox2dSource<Contact<string, string>>;
}

export interface WorkerSinks {
    GameEngine: GameEngineSink<AppState, AppReflectState>;
    World: GameBox2dSink;
}
