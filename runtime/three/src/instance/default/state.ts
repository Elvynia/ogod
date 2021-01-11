import { OgodStateInstance } from "@ogod/common";
import { Object3D } from "three";
import { ThreeStateVec3 } from "../vec3/state";

export interface ThreeStateInstance extends OgodStateInstance {
    position: ThreeStateVec3;
    rotation: ThreeStateVec3;
    object$: Object3D;
}
