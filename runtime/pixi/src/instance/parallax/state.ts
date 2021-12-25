import { Container, Texture } from "pixi.js";
import { PixiStateInstance } from "../default/state";

export interface PixiStateParallax extends PixiStateInstance {
    resource$: Array<Texture>;
    instance$: Container;
    width: number;
    height: number;
    speed: number;
    speedFactor: number;
    ratio: number;
}
