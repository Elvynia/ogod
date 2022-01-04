import { Hybrids } from 'hybrids';
import { ogodDefineActorReactive } from '../actor/define';
import { ogodHybridInstance } from "./hybrid";
import { OGOD_DEFAULT_KEYS } from '../constants';
import { instanceInit, instanceChanges, instanceDestroy } from '@ogod/common';
import { ogodHybridInGroup } from './in-group/hybrid';

export function ogodDefineInstance(tagName: string = 'ogod-instance', stateHybrids?: Hybrids<any>[],
    overrideHybrids?: Hybrids<any>[], additionalKeys: string[] = []) {
    return ogodDefineActorReactive(tagName, 'instance', ogodHybridInstance(), stateHybrids, overrideHybrids,
        OGOD_DEFAULT_KEYS.concat('scenes').concat(additionalKeys), instanceInit, instanceChanges, instanceDestroy);
}

export function ogodDefineInstanceInGroup(tagName: string = 'ogod-instance', stateHybrids?: Hybrids<any>[],
    overrideHybrids?: Hybrids<any>[], additionalKeys: string[] = []) {
    return ogodDefineActorReactive(tagName, 'instance', ogodHybridInstance(), [ogodHybridInGroup(), ...stateHybrids], overrideHybrids,
        OGOD_DEFAULT_KEYS.concat('groups').concat(additionalKeys), instanceInit, instanceChanges, instanceDestroy);
}
