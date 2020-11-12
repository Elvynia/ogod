import { PixiElementSpriteAnimated } from "../sprite-animated/element";

export interface PixiElementCompass extends PixiElementSpriteAnimated {
    animationBase: string;
    compass: number;
}
