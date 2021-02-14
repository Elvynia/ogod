import { ogodDefineInstance } from '@ogod/element-core';
import { Hybrids } from 'hybrids';
import { threeHybridInstance } from '../default/hybrid';
import { threeHybridObject } from './hybrid';

export function threeDefineObject(tagName?: string, stateHybrids: Array<Hybrids<any>> = [], overrideHybrids: Array<Hybrids<any>> = []) {
    return ogodDefineInstance(tagName || 'three-object',
        [threeHybridInstance(), threeHybridObject(), ...stateHybrids],
        [{ runtime: 'object' }, ...overrideHybrids]
    );
}
