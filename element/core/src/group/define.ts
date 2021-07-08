import { instanceChanges, instanceDestroy, instanceInit } from '@ogod/common';
import { Hybrids } from 'hybrids';
import { ogodDefineActorReactive } from '../actor/define';
import { OGOD_DEFAULT_KEYS } from '../constants';
import { ogodHybridInstance } from '../instance/hybrid';
import { ogodHybridGroup } from './hybrid';

export function ogodDefineGroup(tagName: string = 'ogod-group', stateHybrids?: Hybrids<any>[], overrideHybrids?: Hybrids<any>[]) {
    return ogodDefineActorReactive(tagName, 'instance', ogodHybridInstance(), [ogodHybridGroup(), ...stateHybrids], overrideHybrids,
        OGOD_DEFAULT_KEYS.concat('scenes'), instanceInit, instanceChanges, instanceDestroy);
}
