import { ThreeStateVec2 } from './../../instance/vector/state';
import { OgodStateResource } from '@ogod/common';
import { Texture } from 'three';

export interface ThreeStateTexture extends OgodStateResource {
    wrapS: number;
    wrapT: number;
    rotation: number;
    repeat: ThreeStateVec2;
    center: ThreeStateVec2;
    offset: ThreeStateVec2;
    anisotropy: number;
    data$: Texture;
}
