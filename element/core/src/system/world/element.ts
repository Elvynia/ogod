import { OgodElementArea } from './../area/element';
import { OgodElementCamera } from '../camera/element';
import { OgodElementSystem } from '../element';

export interface OgodElementWorld extends OgodElementSystem {
    follow: string;
    bounds: OgodElementArea;
    camera: OgodElementCamera;
}
