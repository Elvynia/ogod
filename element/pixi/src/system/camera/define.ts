import { Hybrids } from 'hybrids';
import { ogodDefineElement, ogodHybridStateAsync } from "@ogod/element-core";
import { pixiHybridCamera } from "./hybrid";

export function pixiDefineCamera(tagName?: string, stateHybrids: Array<Hybrids<any>> = [], overrideHybrids: Array<Hybrids<any>> = []) {
    ogodDefineElement(tagName || 'pixi-camera', pixiHybridCamera(), stateHybrids,
        [ ...overrideHybrids, ogodHybridStateAsync()]);
}
