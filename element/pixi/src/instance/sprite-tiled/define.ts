import { Hybrids } from 'hybrids';
import { ogodDefineInstance } from "@ogod/element-core";
import { pixiHybridInstance } from '../default/hybrid';
import { pixiHybridSprite } from '../sprite/hybrid';
import { pixiHybridSpriteTiled } from './hybrid';

export function pixiDefineSpriteTiled(tagName?: string, stateHybrids: Array<Hybrids<any>> = [], overrideHybrids: Array<Hybrids<any>> = []) {
    return ogodDefineInstance(tagName || 'pixi-sprite-tiled',
        [pixiHybridInstance(), pixiHybridSprite(), pixiHybridSpriteTiled(), ...stateHybrids],
        [{ runtime: 'sprite-tiled' }, ...overrideHybrids]
    );
}