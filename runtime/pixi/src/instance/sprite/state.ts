import { PixiStateInstance } from './../default/state';

export interface PixiStateSprite extends PixiStateInstance {
    resource$: PIXI.Texture | any;
    instance$: PIXI.Sprite;
    anchor?: number;
    anchorX?: number;
    anchorY?: number;
}
