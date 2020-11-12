import { PixiStateSprite } from "../sprite/state";
export interface PixiStateSpriteTiled extends PixiStateSprite {
    instance$: PIXI.TilingSprite;
    width: number;
    height: number;
    speed: number;
    ratio: number;
}
