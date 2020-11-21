import { OgodStateCamera } from './camera/state';
import { OgodStateArea } from './area/state';
import { OgodStateSystem } from '@ogod/common';

export interface OgodStateWorld extends OgodStateSystem {
    follow: string;
    bounds: OgodStateArea;
    camera: OgodStateCamera;
    translation: { x: number, y: number };
}
