import { ogodDefineResource } from '@ogod/element-core';
import { Hybrids } from 'hybrids';

export function threeDefineTexture(tagName?: string, stateHybrids: Array<Hybrids<any>> = [], overrideHybrids: Array<Hybrids<any>> = []) {
    ogodDefineResource(tagName || 'three-texture', stateHybrids, [{ runtime: 'texture' }, ...overrideHybrids]);
}
