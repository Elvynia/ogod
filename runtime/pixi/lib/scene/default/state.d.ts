import { OgodStateScene } from '@ogod/common';
import { PixiStateRenderer } from '../renderer/state';
import * as PIXI from 'pixi.js';
export interface PixiStateScene extends OgodStateScene {
    renderer: PixiStateRenderer;
    context?: OffscreenRenderingContext;
    container$: PIXI.Container;
    renderer$: PIXI.Renderer;
}
