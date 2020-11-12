import { OgodElementScene } from '@ogod/element-core';
import { PixiElementRenderer } from '../renderer/element';

export interface PixiElementScene extends OgodElementScene {
    renderer: PixiElementRenderer;
}
