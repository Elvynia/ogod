import { Hybrids } from 'hybrids';
import { ogodDefineActorReactive } from '../actor/define';
import { ogodHybridSystem } from "./hybrid";
import { OGOD_DEFAULT_KEYS } from '../constants';
import { systemInit, systemChanges, systemDestroy } from '@ogod/common';

export function ogodDefineSystem(tagName: string = 'ogod-system', stateHybrids?: Hybrids<any>[],
    overrideHybrids?: Hybrids<any>[], additionalKeys: string[] = []) {
    return ogodDefineActorReactive(tagName, 'system', ogodHybridSystem(), stateHybrids, overrideHybrids,
        OGOD_DEFAULT_KEYS.concat(additionalKeys), systemInit, systemChanges, systemDestroy);
}
