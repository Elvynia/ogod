import { Hybrids } from 'hybrids';
import { ogodDefineResource } from '@ogod/element-core';

export function pixiDefineSpritesheet(tagName?: string, stateHybrids: Array<Hybrids<any>> = [], overrideHybrids: Array<Hybrids<any>> = []) {
    ogodDefineResource(tagName || 'pixi-spritesheet', stateHybrids, [{ runtime: 'spritesheet' }, ...overrideHybrids]);
}
