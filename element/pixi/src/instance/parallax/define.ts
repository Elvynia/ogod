import { ogodDefineInstance } from '@ogod/element-core';
import { Hybrids } from 'hybrids';
import { pixiHybridInstance } from '../default/hybrid';
import { pixiHybridSprite } from '../sprite/hybrid';
import { pixiHybridParallax } from './hybrid';

export function pixiDefineParallax(tagName?: string, stateHybrids: Array<Hybrids<any>> = [], overrideHybrids: Array<Hybrids<any>> = []) {
    return ogodDefineInstance(tagName || 'pixi-parallax',
        [pixiHybridInstance(), pixiHybridSprite(), pixiHybridParallax(), ...stateHybrids],
        [{ runtime: 'parallax' }, ...overrideHybrids]
    );
}
