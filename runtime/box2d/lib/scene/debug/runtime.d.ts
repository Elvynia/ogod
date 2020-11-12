import { OgodActionScene, OgodStateEngine } from "@ogod/common";
import { OgodRuntimeSceneDefault } from "@ogod/runtime-core";
import { Observable } from "rxjs";
import { Box2dStatePhysics } from '../../system/physics/state';
import { Box2dStateDebug } from "./state";
export declare class Box2dRuntimeDebug extends OgodRuntimeSceneDefault {
    physics: Box2dStatePhysics;
    initialize(state: Box2dStateDebug, state$: Observable<OgodStateEngine>): Observable<OgodActionScene>;
    nextCanvas(state: Box2dStateDebug, canvas: OffscreenCanvas, lastCanvas: OffscreenCanvas): Box2dStateDebug;
    render(state: Box2dStateDebug): void;
    update(delta: number, state: Box2dStateDebug): void;
}
