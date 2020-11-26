import { OgodStateEngine } from '@ogod/common';
import { PixiStateRenderer } from '../renderer/state';

export interface PixiStateEngine extends OgodStateEngine {
    renderer: PixiStateRenderer;
}
