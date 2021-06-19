import { OgodStateInstance } from "@ogod/common";
import { Object3D } from "three";
import { ThreeStateVec3 } from "../vector/state";

export interface ThreeStateInstance extends OgodStateInstance {
    position: ThreeStateVec3;
    rotation: ThreeStateVec3;
    translator: ThreeStateVec3;
    rotator: ThreeStateVec3;
    scale: ThreeStateVec3;
    object$: Object3D;
}
