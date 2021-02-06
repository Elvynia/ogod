import { ThreeElementLightPoint } from "../light-point/element";

export interface ThreeElementLightSpot extends ThreeElementLightPoint {
    angle: number;
    penumbra: number;
    helper: boolean;
}
