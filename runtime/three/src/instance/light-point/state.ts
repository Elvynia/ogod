import { ThreeStateLight } from './../light/state';

export interface ThreeStateLightPoint extends ThreeStateLight {
    distance: number;
    decay: number;
}
