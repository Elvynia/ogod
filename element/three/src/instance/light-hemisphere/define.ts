import { Hybrids } from 'hybrids';
import { ogodDefineInstance } from '@ogod/element-core';
import { threeHybridLightHemisphere } from '../light-hemisphere/hybrid';
import { threeHybridInstance } from '../default/hybrid';

export function threeDefineLightHemisphere(tagName?: string, stateHybrids: Array<Hybrids<any>> = [], overrideHybrids: Array<Hybrids<any>> = []) {
    return ogodDefineInstance(tagName || 'three-light-hemisphere',
        [threeHybridInstance(), threeHybridLightHemisphere(), ...stateHybrids],
        [{ runtime: 'light-hemisphere' }, ...overrideHybrids]
    );
}
