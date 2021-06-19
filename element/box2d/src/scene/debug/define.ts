import { ogodDefineScene } from '@ogod/element-core';
import { Hybrids } from 'hybrids';
import { box2dHybridDebug } from './hybrid';

export function box2dDefineDebug(tagName?: string, stateHybrids: Array<Hybrids<any>> = [], overrideHybrids: Array<Hybrids<any>> = []) {
    return ogodDefineScene(tagName || 'box2d-debug', [box2dHybridDebug(), ...stateHybrids],
        [{ runtime: 'box2d-debug' }, ...overrideHybrids]);
}
