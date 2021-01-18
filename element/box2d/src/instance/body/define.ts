import { ogodDefineActorAsync } from '@ogod/element-core';
import { Hybrids } from 'hybrids';
import { box2dHybridBody } from './hybrid';

export function box2dDefineBody(tagName?: string, stateHybrids: Array<Hybrids<any>> = [], overrideHybrids: Array<Hybrids<any>> = []) {
    ogodDefineActorAsync(tagName || 'box2d-body', box2dHybridBody(), stateHybrids, overrideHybrids);
}
