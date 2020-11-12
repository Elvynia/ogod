import { PixiStateInstance } from "../default/state";
export interface PixiStateParallax extends PixiStateInstance {
    resource$: Array<PIXI.Texture>;
    instance$: PIXI.Container;
    width: number;
    height: number;
    speed: number;
    speedFactor: number;
    ratio: number;
}
