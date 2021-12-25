import { Texture } from "pixi.js";
import { PixiStateResource } from "../default/state";

export interface PixiStateTexture extends PixiStateResource {
    data$: Texture;
}
