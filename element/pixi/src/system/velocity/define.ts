import { Hybrids } from 'hybrids';
import { ogodDefineSystem } from '@ogod/element-core';
import { pixiHybridVelocity } from './hybrid';

export function pixiDefineVelocity(tagName?: string, stateHybrids: Array<Hybrids<any>> = [], overrideHybrids: Array<Hybrids<any>> = []) {
    ogodDefineSystem(tagName || 'pixi-velocity',
        [pixiHybridVelocity(), ...stateHybrids],
        [{ runtime: 'velocity' }, ...overrideHybrids]
    );
}
