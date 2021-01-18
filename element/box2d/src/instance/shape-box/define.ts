import { ogodDefineActorAsync } from '@ogod/element-core';
import { Hybrids } from 'hybrids';
import { box2dHybridShapeBox } from './hybrid';

export function box2dDefineShapeBox(tagName?: string, stateHybrids: Array<Hybrids<any>> = [], overrideHybrids: Array<Hybrids<any>> = []) {
    ogodDefineActorAsync(tagName || 'box2d-shape-box', box2dHybridShapeBox(), stateHybrids, overrideHybrids);
}
