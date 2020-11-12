import { PixiStateResource } from './../default/state';

export interface PixiStateTextures extends PixiStateResource {
    data$: Array<PIXI.Texture>;
    paths: Array<string>;
}
