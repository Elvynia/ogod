import { EngineSink, EngineSource } from "@ogod/driver-engine";
import { WorkerSource } from "@ogod/driver-worker";
import { XY } from "@ogod/examples-common";
import { PerspectiveCamera, Scene } from "three";

export interface AppState {
    camera: PerspectiveCamera;
    scene: Scene;
}

export interface ReflectState {
}

export class ActionHandlers {
    constructor(
        public paused?: void,
        public pointer?: XY
    ) { }
}

export interface AppSources {
    Worker: WorkerSource<ReflectState>;
}

export interface WorkerSources {
    Engine: EngineSource<AppState, ActionHandlers>;
}

export interface WorkerSinks {
    Engine: EngineSink<AppState, ReflectState>;
}
