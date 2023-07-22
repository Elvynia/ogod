import { EngineSink, EngineSource } from "@ogod/driver-engine";
import { WorkerSource } from "@ogod/driver-worker";
import { XY } from "@ogod/examples-common";
import { PerspectiveCamera, Raycaster, Scene, Vector2 } from "three";
import { Cube, CubeState } from "./cubes/state";

export interface AppState {
    camera: PerspectiveCamera;
    cubes: CubeState;
    paused: boolean;
    pointer: Vector2;
    radius: number;
    raycaster: Raycaster;
    scene: Scene;
    selectColor: string;
    selected?: Cube;
    theta: number;
}

export interface ReflectState {
    name?: string;
    position?: XY;
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
