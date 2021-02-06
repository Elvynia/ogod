import { ogodDefineInstance } from '@ogod/element-core';
import { Hybrids } from 'hybrids';
import { threeHybridInstance } from '../default/hybrid';
import { threeHybridLightPoint } from '../light-point/hybrid';
import { threeHybridLight } from '../light/hybrid';
import { threeHybridLightSpot } from './hybrid';

export function threeDefineLightSpot(tagName?: string, stateHybrids: Array<Hybrids<any>> = [], overrideHybrids: Array<Hybrids<any>> = []) {
    return ogodDefineInstance(tagName || 'three-light-spot',
        [threeHybridInstance(), threeHybridLight(), threeHybridLightPoint(), threeHybridLightSpot(), ...stateHybrids],
        [{ runtime: 'light-spot' }, ...overrideHybrids]
    );
}
