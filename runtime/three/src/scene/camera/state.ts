import { ThreeStateVec3 } from "../../instance/vector/state";

export interface ThreeStateCamera {
    fov: number;
    ratio: number;
    near: number;
    far: number;
    position: ThreeStateVec3;
}
