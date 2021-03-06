import { ThreeStateCamera } from './../camera/state';
import { OgodStateScene } from "@ogod/common";
import { Camera, Scene } from "three";

export interface ThreeStateScene extends OgodStateScene {
    autoUpdate?: boolean;
    background?: any;
    // environment: Texture;
    // fog: Fog;
    // overrideMaterial: Material;
    camera: ThreeStateCamera;
    camera$?: Camera;
    scene$?: Scene;
}
