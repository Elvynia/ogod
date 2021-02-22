import { ThreeElementCamera } from './../camera/element';
import { OgodElementScene } from '@ogod/element-core';
import { ThreeElementFog } from '../fog/element';

export interface ThreeElementScene extends OgodElementScene {
    autoUpdate: boolean;
    background: any;
    camera: ThreeElementCamera;
    fog: ThreeElementFog;
}
