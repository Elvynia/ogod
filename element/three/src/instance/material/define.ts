import { ogodDefineActorAsync } from '@ogod/element-core';
import { Hybrids } from 'hybrids';
import { threeHybridMaterial } from './hybrid';

export function threeDefineMaterial(tagName?: string, stateHybrids: Array<Hybrids<any>> = [], overrideHybrids: Array<Hybrids<any>> = []) {
    return ogodDefineActorAsync(tagName || 'three-material', threeHybridMaterial(), stateHybrids, overrideHybrids);
}
