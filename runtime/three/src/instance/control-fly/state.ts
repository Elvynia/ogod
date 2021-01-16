import { Quaternion } from 'three';
import { ThreeStateInstance } from '../default/state';

export interface ThreeStateControlFly extends ThreeStateInstance {
    // keys: OgodStateKeys;
    keys: {
        shift: boolean, up: number, down: number, left: number, right: number, forward: number, back: number,
        pitchUp: number, pitchDown: number, yawLeft: number, yawRight: number, rollLeft: number, rollRight: number };
    mouseDown: boolean;
    movementSpeed: number;
    rollSpeed: number;
    dragToLook: boolean;
    autoForward: boolean;
    tmpQuaternion: Quaternion;
    speedMultiplier: number;
}
