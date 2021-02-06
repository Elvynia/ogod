import { ThreeStateVec2, ThreeStateVec3 } from '@ogod/runtime-three';

export interface ThreeElementVec2 extends ThreeStateVec2, HTMLElement {
    category: 'vec2';
}

export interface ThreeElementVec3 extends ThreeStateVec3, HTMLElement {
    category: 'vec3';
}
