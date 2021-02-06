import { ogodDefineInstance } from '@ogod/element-core';
import { Hybrids } from 'hybrids';
import { threeHybridInstance } from '../default/hybrid';
import { threeHybridControlFly } from './hybrid';

export function threeDefineControlFly(tagName?: string, stateHybrids: Array<Hybrids<any>> = [], overrideHybrids: Array<Hybrids<any>> = []) {
    return ogodDefineInstance(tagName || 'three-control-fly',
        [threeHybridInstance(), threeHybridControlFly(), ...stateHybrids],
        [{ runtime: 'control-fly' }, ...overrideHybrids]
    );
}
