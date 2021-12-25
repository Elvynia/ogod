import { TilingSprite } from "pixi.js";
import { PixiStateSprite } from "../sprite/state";

export interface PixiStateSpriteTiled extends PixiStateSprite {
    instance$: TilingSprite;
    width: number;
    height: number;
    speed: number;
    ratio: number;
}
