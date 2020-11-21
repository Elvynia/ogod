import { PixiElementSprite } from './../sprite/element';

export interface PixiElementParallax extends PixiElementSprite {
    width: number;
    height: number;
    speed: number;
    speedFactor: number;
    ratio: number;
}
