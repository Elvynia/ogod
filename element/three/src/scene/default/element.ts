import { ThreeElementCamera } from './../camera/element';
import { OgodElementScene } from '@ogod/element-core';

export interface ThreeElementScene extends OgodElementScene {
    autoUpdate: boolean;
    background: any;
    camera: ThreeElementCamera;
}
