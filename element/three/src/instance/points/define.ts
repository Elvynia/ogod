import { Hybrids } from 'hybrids';
import { ogodDefineInstance } from '@ogod/element-core';
import { threeHybridInstance } from '../default/hybrid';
import { threeHybridPoints } from './hybrid';

export function threeDefinePoints(tagName?: string, stateHybrids: Array<Hybrids<any>> = [], overrideHybrids: Array<Hybrids<any>> = []) {
    return ogodDefineInstance(tagName || 'three-points',
        [threeHybridInstance(), threeHybridPoints(), ...stateHybrids],
        [{ runtime: 'points' }, ...overrideHybrids]
    );
}
