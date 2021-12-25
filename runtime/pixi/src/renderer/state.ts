import { OgodStateActor } from "@ogod/common";
import { Renderer } from "pixi.js";

export interface PixiStateRenderer extends OgodStateActor<'renderer'> {
    width: number;
    height: number;
    transparent?: boolean;
    autoDensity?: boolean;
    antialias?: boolean;
    resolution?: number;
    clearBeforeRender?: boolean;
    preserveDrawingBuffer?: boolean;
    backgroundColor?: number;
    powerPreference?: WebGLPowerPreference;
    renderer$?: Renderer;
}
