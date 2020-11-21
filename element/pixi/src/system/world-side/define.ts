import { Hybrids } from 'hybrids';
import { ogodDefineSystem, ogodHybridWorld } from '@ogod/element-core';
import { pixiHybridWorldSide } from './hybrid';

export function pixiDefineWorldSide(tagName?: string, stateHybrids: Array<Hybrids<any>> = [], overrideHybrids: Array<Hybrids<any>> = []) {
    ogodDefineSystem(tagName || 'pixi-world-side',
        [ogodHybridWorld(), pixiHybridWorldSide(), ...stateHybrids],
        [{ runtime: 'world-side' }, ...overrideHybrids]
    );
}
