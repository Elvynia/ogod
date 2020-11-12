import { PixiStateCamera } from './camera/state';
import { PixiStateArea } from './area/state';
import { OgodStateSystem } from '@ogod/common';

export interface PixiStateWorld extends OgodStateSystem {
    follow: string;
    bounds: PixiStateArea;
    camera: PixiStateCamera;
    translation: { x: number, y: number };
}
