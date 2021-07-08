import { ogodDefineGroup, ogodDefineInstance } from '@ogod/element-core';
import { Hybrids } from "hybrids";
import { threeHybridInstance } from '../instance/default/hybrid';

export function threeDefineGroup(tagName?: string, stateHybrids: Array<Hybrids<any>> = [], overrideHybrids: Array<Hybrids<any>> = []) {
    return ogodDefineGroup(tagName || 'three-group',
        [threeHybridInstance(), ...stateHybrids],
        [{ runtime: 'group' }, ...overrideHybrids]
    );
}
