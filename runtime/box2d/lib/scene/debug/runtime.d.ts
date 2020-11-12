import { b2Body, b2Fixture } from '@flyover/box2d';
import { OgodActionScene, OgodStateEngine } from "@ogod/common";
import { OgodRuntimeSceneDefault } from "@ogod/runtime-core";
import { Observable } from "rxjs";
import { Box2dStateDebug } from "./state";
export declare class Box2dRuntimeDebug extends OgodRuntimeSceneDefault {
    initialize(state: Box2dStateDebug, state$: Observable<OgodStateEngine>): Observable<OgodActionScene>;
    nextCanvas(state: Box2dStateDebug, canvas: OffscreenCanvas, lastCanvas: OffscreenCanvas): Box2dStateDebug;
    render(state: Box2dStateDebug): void;
    update(delta: number, state: Box2dStateDebug): void;
    protected addGraphic(state: Box2dStateDebug, body: b2Body, fx: b2Fixture): void;
}
