import { SpotLight } from 'three';
import { ThreeStateLight } from './../light/state';

export interface ThreeStateLightSpot extends ThreeStateLight {
    distance: number;
    angle: number;
    penumbra: number;
    decay: number;
    helper: boolean;
    object$: SpotLight;
}
