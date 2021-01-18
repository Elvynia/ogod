import { ogodDefineActorReactive, OGOD_DEFAULT_KEYS } from "@ogod/element-core";
import { rendererDestroy, rendererInit, rendererChanges } from '@ogod/runtime-pixi';
import { Hybrids } from 'hybrids';
import { pixiHybridRenderer } from "./hybrid";

export function pixiDefineRenderer(tagName?: string, stateHybrids: Array<Hybrids<any>> = [], overrideHybrids: Array<Hybrids<any>> = []) {
    return ogodDefineActorReactive(tagName || 'pixi-renderer', 'renderer', pixiHybridRenderer(), stateHybrids, overrideHybrids,
        OGOD_DEFAULT_KEYS, rendererInit, rendererChanges, rendererDestroy);
}
