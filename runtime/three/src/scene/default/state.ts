import { ThreeStateCamera } from './../camera/state';
import { OgodStateScene } from "@ogod/common";
import { PerspectiveCamera, Scene } from "three";
import { ThreeStateFog } from '../fog/state';

export interface ThreeStateScene extends OgodStateScene {
    autoUpdate?: boolean;
    background?: any;
    // environment: Texture;
    fog: ThreeStateFog;
    // overrideMaterial: Material;
    camera: ThreeStateCamera;
    camera$?: PerspectiveCamera;
    scene$?: Scene;
}
