import { Sprite, Texture } from 'pixi.js';
import { PixiStateInstance } from './../default/state';

export interface PixiStateSprite extends PixiStateInstance {
    resource$: Texture | any;
    instance$: Sprite;
    anchor?: number;
    anchorX?: number;
    anchorY?: number;
}
