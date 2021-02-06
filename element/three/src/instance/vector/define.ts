import { ogodDefineActorAsync } from '@ogod/element-core';
import { Hybrids } from 'hybrids';
import { threeHybridVec2, threeHybridVec3 } from './hybrid';

export function threeDefineVec2(tagName?: string, stateHybrids: Array<Hybrids<any>> = [], overrideHybrids: Array<Hybrids<any>> = []) {
    return ogodDefineActorAsync(tagName || 'three-vec2', threeHybridVec2(), stateHybrids, overrideHybrids);
}

export function threeDefineVec3(tagName?: string, stateHybrids: Array<Hybrids<any>> = [], overrideHybrids: Array<Hybrids<any>> = []) {
    return ogodDefineActorAsync(tagName || 'three-vec3', threeHybridVec3(), stateHybrids, overrideHybrids);
}
