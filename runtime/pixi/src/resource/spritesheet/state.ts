import { Spritesheet } from 'pixi.js';
import { PixiStateResource } from './../default/state';

export interface PixiStateSpritesheet extends PixiStateResource {
    data$: Spritesheet;
}
