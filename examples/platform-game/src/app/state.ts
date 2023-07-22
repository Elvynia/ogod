import { Box2dSink, Box2dSource, Contact } from '@ogod/driver-box2d';
import { EngineSink, EngineSource, FeatureKey } from '@ogod/driver-engine';
import { WorkerSource } from '@ogod/driver-worker';
import { Background } from './background/state';
import { Camera } from './camera/state';
import { Controls } from './controls/state';
import { LoadingState } from './loading/state';
import { MapState } from './map/state';
import { PHASE } from './phase/state';
import { Shapes } from './shape/state';
import { SplashState } from './splash';

export type AppReflectState = Pick<AppState, 'phase' | 'loading' | 'fps' | 'paused'>
    & Pick<MapState, 'level' | 'gravity'>
    & Pick<Background, 'baseColor'>;

export interface AppSources {
    Worker: WorkerSource<AppReflectState>;
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
        public paused?: void,
        public phase?: number
    ) { }
}

export interface WorkerSources {
    Engine: EngineSource<AppState, ActionHandlers>;
    World: Box2dSource<Contact<string, string>>;
}

export interface WorkerSinks {
    Engine: EngineSink<AppState, AppReflectState>;
    World: Box2dSink;
}
