import { PixiStateSpriteAnimated } from "../sprite-animated/state";

export interface PixiStateSpriteCompass extends PixiStateSpriteAnimated {
    animationBase: string;
    compass: number;
}
