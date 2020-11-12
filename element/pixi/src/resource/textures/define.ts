import { Hybrids } from 'hybrids';
import { ogodDefineResources } from '@ogod/element-core';

export function pixiDefineTextures(tagName?: string, stateHybrids: Array<Hybrids<any>> = [], overrideHybrids: Array<Hybrids<any>> = []) {
    ogodDefineResources(tagName || 'pixi-textures', stateHybrids, [{ runtime: 'textures' }, ...overrideHybrids]);
}
