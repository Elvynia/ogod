import { OgodElementKeys } from '@ogod/element-core';
import { ThreeElementInstance } from './../default/element';

export interface ThreeElementControlFly extends ThreeElementInstance {
    keys: OgodElementKeys,
    mouseDown: boolean;
    movementSpeed: number;
    rollSpeed: number;
    dragToLook: boolean;
    autoForward: boolean;
    speedMultiplier: number;
}
