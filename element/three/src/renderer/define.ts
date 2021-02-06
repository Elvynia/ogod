import { ogodDefineActorReactive, OGOD_DEFAULT_KEYS } from '@ogod/element-core';
import { rendererDestroy, rendererInit, rendererChanges } from '@ogod/runtime-three';
import { Hybrids } from 'hybrids';
import { threeHybridRenderer } from './hybrid';

export function threeDefineRenderer(tagName?: string, stateHybrids: Array<Hybrids<any>> = [], overrideHybrids: Array<Hybrids<any>> = []) {
    return ogodDefineActorReactive(tagName || 'three-renderer', 'renderer', threeHybridRenderer(), stateHybrids, overrideHybrids,
        OGOD_DEFAULT_KEYS, rendererInit, rendererChanges, rendererDestroy);
}
