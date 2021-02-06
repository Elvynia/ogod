import { ogodDefineActorAsync } from '@ogod/element-core';
import { Hybrids } from 'hybrids';
import { threeHybridGeometry } from './hybrid';

export function threeDefineGeometry(tagName?: string, stateHybrids: Array<Hybrids<any>> = [], overrideHybrids: Array<Hybrids<any>> = []) {
    return ogodDefineActorAsync(tagName || 'three-geometry', threeHybridGeometry(), stateHybrids, overrideHybrids);
}
