import { Box2dStateDebug } from "@ogod/runtime-box2d";
import { OgodStateCamera } from "@ogod/runtime-core";

export interface PixiStateDebugBox2d extends Box2dStateDebug {
    worldId: string;
    camera: OgodStateCamera;
    renderer$: PIXI.Renderer;
    graphics$: PIXI.Graphics;
}
