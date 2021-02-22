import { HemisphereLight } from 'three';
import { ThreeStateLight } from './../light/state';

export interface ThreeStateLightHemisphere extends ThreeStateLight {
    groundColor: any;
    object$: HemisphereLight;
}
