import { PixiElementSprite } from './../sprite/element';

export interface PixiElementSpriteAnimated extends PixiElementSprite {
    animation: string;
    playing: boolean;
    loop: boolean;
    duration: number;
    durations: Array<number>;
}
