import { OgodStateScene } from '@ogod/common';
import * as PIXI from 'pixi.js';

export interface PixiStateScene extends OgodStateScene {
    container$: PIXI.Container;
}
