import { ogodDefineEngine } from '@ogod/element-core';
import { Hybrids } from 'hybrids';

export function threeDefineEngine(tagName?: string, stateHybrids?: Hybrids<any>[], overrideHybrids?: Hybrids<any>[]) {
    return ogodDefineEngine(tagName || 'three-engine', stateHybrids, overrideHybrids, ['renderer']);
}
