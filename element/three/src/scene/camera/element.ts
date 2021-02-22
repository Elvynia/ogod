import { ThreeElementVec3 } from "../../instance/vector/element";

export interface ThreeElementCamera extends HTMLElement {
    category: 'camera';
    fov: number;
    ratio: number;
    near: number;
    far: number;
    position: ThreeElementVec3;
    up: ThreeElementVec3;
    lookAt: ThreeElementVec3;
}
