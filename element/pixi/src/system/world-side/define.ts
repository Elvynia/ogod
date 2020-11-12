import { Hybrids } from 'hybrids';
import { ogodDefineSystem } from '@ogod/element-core';
import { pixiHybridWorld } from '../world/hybrid';
import { pixiHybridWorldSide } from './hybrid';

export function pixiDefineWorldSide(tagName?: string, stateHybrids: Array<Hybrids<any>> = [], overrideHybrids: Array<Hybrids<any>> = []) {
    ogodDefineSystem(tagName || 'pixi-world-side',
        [pixiHybridWorld(), pixiHybridWorldSide(), ...stateHybrids],
        [{ runtime: 'world-side' }, ...overrideHybrids]
    );
}
