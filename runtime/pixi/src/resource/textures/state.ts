import { Texture } from 'pixi.js';
import { PixiStateResource } from './../default/state';

export interface PixiStateTextures extends PixiStateResource {
    data$: Array<Texture>;
    paths: Array<string>;
}
