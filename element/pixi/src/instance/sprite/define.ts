import { ogodDefineInstance } from '@ogod/element-core';
import { Hybrids } from 'hybrids';
import { pixiHybridInstance } from '../default/hybrid';
import { pixiHybridSprite } from './hybrid';

export function pixiDefineSprite(tagName?: string, stateHybrids: Array<Hybrids<any>> = [], overrideHybrids: Array<Hybrids<any>> = []) {
    return ogodDefineInstance(tagName || 'pixi-sprite',
        [pixiHybridInstance(), pixiHybridSprite(), ...stateHybrids],
        [{ runtime: 'sprite' }, ...overrideHybrids]
    );
}
