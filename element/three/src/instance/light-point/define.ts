import { Hybrids } from 'hybrids';
import { ogodDefineInstance } from '@ogod/element-core';
import { threeHybridLight } from '../light/hybrid';
import { threeHybridInstance } from '../default/hybrid';
import { threeHybridLightPoint } from './hybrid';

export function threeDefineLightPoint(tagName?: string, stateHybrids: Array<Hybrids<any>> = [], overrideHybrids: Array<Hybrids<any>> = []) {
    return ogodDefineInstance(tagName || 'three-light-point',
        [threeHybridInstance(), threeHybridLight(), threeHybridLightPoint(), ...stateHybrids],
        [{ runtime: 'light-point' }, ...overrideHybrids]
    );
}
