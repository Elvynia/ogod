import { Light } from 'three';
import { ThreeStateInstance } from './../default/state';

export interface ThreeStateLight extends ThreeStateInstance {
    color: any;
    intensity: number;
    object$: Light;
}
