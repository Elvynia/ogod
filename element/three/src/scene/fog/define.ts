import { ogodDefineActorAsync } from '@ogod/element-core';
import { Hybrids } from 'hybrids';
import { threeHybridFog } from './hybrid';

export function threeDefineFog(tagName?: string, stateHybrids: Array<Hybrids<any>> = [], overrideHybrids: Array<Hybrids<any>> = []) {
    return ogodDefineActorAsync(tagName || 'three-fog', threeHybridFog(), stateHybrids, overrideHybrids);
}
