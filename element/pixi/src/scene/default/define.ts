import { Hybrids } from 'hybrids';
import { ogodDefineScene } from "@ogod/element-core";
import { PixiElementScene } from "./element";
import { pixiHybridScene } from "./hybrid";

export function pixiDefineScene(tagName?: string, stateHybrids: Array<Hybrids<any>> = [], overrideHybrids: Array<Hybrids<any>> = []): hybrids.HybridElement<PixiElementScene> {
    return ogodDefineScene(tagName || 'pixi-scene', [pixiHybridScene(), ...stateHybrids], overrideHybrids) as hybrids.HybridElement<PixiElementScene>;
}
