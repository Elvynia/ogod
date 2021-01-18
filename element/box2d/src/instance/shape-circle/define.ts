import { ogodDefineActorAsync } from '@ogod/element-core';
import { Hybrids } from 'hybrids';
import { box2dHybridShapeCircle } from './hybrid';

export function box2dDefineShapeCircle(tagName?: string, stateHybrids: Array<Hybrids<any>> = [], overrideHybrids: Array<Hybrids<any>> = []) {
    ogodDefineActorAsync(tagName || 'box2d-shape-circle', box2dHybridShapeCircle(), stateHybrids, overrideHybrids);
}
