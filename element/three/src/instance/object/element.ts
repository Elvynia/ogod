import { ThreeImportType } from '@ogod/runtime-three';
import { ThreeElementInstance } from './../default/element';

export interface ThreeElementObject extends ThreeElementInstance, HTMLElement {
    path: string;
    state: ThreeImportType;
}
