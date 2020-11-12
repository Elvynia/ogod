import { PixiElementArea } from './../area/element';
import { OgodElementSystem } from '@ogod/element-core';
import { PixiElementCamera } from '../camera/element';

export interface PixiElementWorld extends OgodElementSystem {
    follow: string;
    bounds: PixiElementArea;
    camera: PixiElementCamera;
}
