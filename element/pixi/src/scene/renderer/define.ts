import { Hybrids } from 'hybrids';
import { ogodDefineElement, ogodHybridStateAsync } from "@ogod/element-core";
import { pixiHybridRenderer } from "./hybrid";

export function pixiDefineRenderer(tagName?: string, stateHybrids: Array<Hybrids<any>> = [], overrideHybrids: Array<Hybrids<any>> = []) {
    return ogodDefineElement(tagName || 'pixi-renderer', pixiHybridRenderer(), stateHybrids,
        [ ...overrideHybrids, ogodHybridStateAsync()]);
}
