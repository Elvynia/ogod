import { OgodStateEngine } from '@ogod/common';
import { ThreeStateRenderer } from '../renderer/default/state';

export interface ThreeStateEngine extends OgodStateEngine {
    renderer: ThreeStateRenderer;
}
