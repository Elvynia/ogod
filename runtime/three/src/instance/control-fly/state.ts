import { OgodFeatureKeys } from '@ogod/runtime-core';
import { Quaternion } from 'three';
import { ThreeStateInstance } from '../default/state';

export interface ThreeStateControlFly extends ThreeStateInstance, OgodFeatureKeys {
    mouseDown: boolean;
    movementSpeed: number;
    rollSpeed: number;
    dragToLook: boolean;
    tmpQuaternion: Quaternion;
    speedMultiplier: number;
}
