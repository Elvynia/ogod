import { ThreeElementVec3 } from './../vector/element';
import { OgodElementInstance } from '@ogod/element-core';

export interface ThreeElementInstance extends OgodElementInstance {
    position: ThreeElementVec3;
    rotation: ThreeElementVec3;
    translator: ThreeElementVec3;
    rotator: ThreeElementVec3;
}
