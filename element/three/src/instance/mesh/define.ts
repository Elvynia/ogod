import { ogodDefineInstance } from '@ogod/element-core';
import { Hybrids } from 'hybrids';
import { threeHybridInstance } from '../default/hybrid';
import { threeHybridMesh } from './hybrid';

export function threeDefineMesh(tagName?: string, stateHybrids: Array<Hybrids<any>> = [], overrideHybrids: Array<Hybrids<any>> = []) {
    return ogodDefineInstance(tagName || 'three-mesh',
        [threeHybridInstance(), threeHybridMesh(), ...stateHybrids],
        [{ runtime: 'mesh' }, ...overrideHybrids]
    );
}
