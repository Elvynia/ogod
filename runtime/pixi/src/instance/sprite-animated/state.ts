import { AnimatedSprite, Spritesheet } from "pixi.js";
import { PixiStateSprite } from "../sprite/state";

export interface PixiStateSpriteAnimated extends PixiStateSprite {
    resource$: Spritesheet;
    instance$: AnimatedSprite;
    animation: string;
    playing: boolean;
    loop: boolean;
    duration?: number;
    durations?: Array<number>;
}
