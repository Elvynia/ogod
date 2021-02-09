import { PointsMaterialParameters } from 'three';
import { ThreeStateInstance } from './../default/state';

export interface ThreeStatePoints extends ThreeStateInstance {
    params: PointsMaterialParameters;
    vertices: number[];
    resource: string;
}
