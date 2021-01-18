import { ogodDefineEngine } from '@ogod/element-core';
import { Hybrids } from 'hybrids';

export function pixiDefineEngine(tagName?: string, stateHybrids?: Hybrids<any>[], overrideHybrids?: Hybrids<any>[]) {
    return ogodDefineEngine(tagName || 'pixi-engine', stateHybrids, overrideHybrids, ['renderer']);
}
