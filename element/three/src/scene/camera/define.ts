import { ogodDefineActorAsync, ogodHybridStateAsync } from '@ogod/element-core';
import { Hybrids } from 'hybrids';
import { threeHybridCamera } from './hybrid';

export function threeDefineCamera(tagName?: string, stateHybrids: Array<Hybrids<any>> = [], overrideHybrids: Array<Hybrids<any>> = []) {
    return ogodDefineActorAsync(tagName || 'three-camera', threeHybridCamera(), stateHybrids, overrideHybrids);
}
