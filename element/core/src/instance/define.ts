import { Hybrids } from 'hybrids';
import { ogodDefineActorReactive } from '../actor/define';
import { ogodHybridInstance } from "./hybrid";
import { OGOD_DEFAULT_KEYS } from '../constants';
import { instanceInit, instanceChanges, instanceDestroy } from '@ogod/common';

export function ogodDefineInstance(tagName: string = 'ogod-instance', stateHybrids?: Hybrids<any>[], overrideHybrids?: Hybrids<any>[]) {
    return ogodDefineActorReactive(tagName, 'instance', ogodHybridInstance(), stateHybrids, overrideHybrids,
        OGOD_DEFAULT_KEYS.concat('scenes'), instanceInit, instanceChanges, instanceDestroy);
}
