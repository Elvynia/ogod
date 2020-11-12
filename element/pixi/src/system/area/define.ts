import { Hybrids } from 'hybrids';
import { ogodDefineElement, ogodHybridStateAsync } from "@ogod/element-core";
import { pixiHybridArea } from './hybrid';

export function pixiDefineArea(tagName?: string, stateHybrids: Array<Hybrids<any>> = [], overrideHybrids: Array<Hybrids<any>> = []) {
    ogodDefineElement(tagName || 'pixi-area', pixiHybridArea(), stateHybrids,
        [ ...overrideHybrids, ogodHybridStateAsync()]);
}
