import { OgodElementActor } from "@ogod/element-core";

export interface PixiElementRenderer extends OgodElementActor<'renderer'> {
    transparent: boolean;
    width: number;
    height: number;
    autoDensity: boolean;
    antialias: boolean;
    resolution: number;
    clearBeforeRender: boolean;
    preserveDrawingBuffer: boolean;
    backgroundColor: number;
    powerPreference: number;
}
