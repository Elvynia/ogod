import { Hybrids } from 'hybrids';
import { ogodDefineSystem } from "@ogod/element-core";
import { box2dHybridJump } from "./hybrid";

export function box2dDefineJump(tagName?: string, stateHybrids: Array<Hybrids<any>> = [], overrideHybrids: Array<Hybrids<any>> = []) {
    ogodDefineSystem(tagName || 'box2d-jump', [box2dHybridJump(), ...stateHybrids], overrideHybrids);
}
