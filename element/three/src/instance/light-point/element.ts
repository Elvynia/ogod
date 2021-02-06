import { ThreeElementLight } from "../light/element";

export interface ThreeElementLightPoint extends ThreeElementLight {
    distance: number;
    decay: number;
    helper: boolean;
}
