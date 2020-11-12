import { Hybrids } from 'hybrids';
import { ogodDefineResource } from '@ogod/element-core';

export function pixiDefineTexture(tagName?: string, stateHybrids: Array<Hybrids<any>> = [], overrideHybrids: Array<Hybrids<any>> = []) {
    ogodDefineResource(tagName || 'pixi-texture', stateHybrids, [{ runtime: 'texture' }, ...overrideHybrids]);
}
