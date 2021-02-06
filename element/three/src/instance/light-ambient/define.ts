import { Hybrids } from 'hybrids';
import { ogodDefineInstance } from '@ogod/element-core';
import { threeHybridLight } from '../light/hybrid';
import { threeHybridInstance } from '../default/hybrid';

export function threeDefineLightAmbient(tagName?: string, stateHybrids: Array<Hybrids<any>> = [], overrideHybrids: Array<Hybrids<any>> = []) {
    return ogodDefineInstance(tagName || 'three-light-ambient',
        [threeHybridInstance(), threeHybridLight(), ...stateHybrids],
        [{ runtime: 'light-ambient' }, ...overrideHybrids]
    );
}
