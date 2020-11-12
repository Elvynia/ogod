import { OgodStateScene } from "@ogod/common";

export interface Box2dStateDebug extends OgodStateScene {
    physicsId: string;
    draw: boolean;
    graphics: { [id: string]: any };
    context$: OffscreenCanvasRenderingContext2D;
}
