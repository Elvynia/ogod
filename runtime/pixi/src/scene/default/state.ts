import { OgodStateScene } from '@ogod/common';
import { Container } from 'pixi.js';

export interface PixiStateScene extends OgodStateScene {
    container$: Container;
}
