import { Box2dStateDebug } from "@ogod/runtime-box2d";
import { OgodStateCamera } from "@ogod/runtime-core";
import { Graphics, Renderer } from "pixi.js";

export interface PixiStateDebugBox2d extends Box2dStateDebug {
    worldId: string;
    camera: OgodStateCamera;
    renderer$: Renderer;
    graphics$: Graphics;
}
