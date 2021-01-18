import { ogodDefineActorAsync } from '@ogod/element-core';
import { Hybrids } from 'hybrids';
import { box2dHybridShapePoly } from './hybrid';

export function box2dDefineShapePoly(tagName?: string, stateHybrids: Array<Hybrids<any>> = [], overrideHybrids: Array<Hybrids<any>> = []) {
    ogodDefineActorAsync(tagName || 'box2d-shape-poly', box2dHybridShapePoly(), stateHybrids, overrideHybrids);
}
