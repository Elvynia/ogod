import { PixiStateCamera } from '@ogod/runtime-pixi';
import { Box2dStateDebug } from "@ogod/runtime-box2d";

export interface PixiStateDebugBox2d extends Box2dStateDebug {
    worldId: string;
    camera: PixiStateCamera;
    renderer$: PIXI.Renderer;
    graphics$: PIXI.Graphics;
}
