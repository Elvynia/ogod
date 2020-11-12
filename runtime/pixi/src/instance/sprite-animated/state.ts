import { PixiStateSprite } from "../sprite/state";

export interface PixiStateSpriteAnimated extends PixiStateSprite {
    resource$: PIXI.Spritesheet;
    instance$: PIXI.AnimatedSprite;
    animation: string;
    playing: boolean;
    loop: boolean;
    duration?: number;
    durations?: Array<number>;
}
