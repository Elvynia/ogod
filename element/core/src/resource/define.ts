import { Hybrids } from 'hybrids';
import { ogodDefineActorReactive } from '../actor/define';
import { ogodHybridResource, ogodHybridResources } from "./hybrid";
import { OGOD_DEFAULT_KEYS } from '../constants';
import { resourceInit, resourceDestroy } from '@ogod/common';

export function ogodDefineResource(tagName: string = 'ogod-resource', stateHybrids?: Hybrids<any>[],
    overrideHybrids?: Hybrids<any>[], additionalKeys: string[] = []) {
    return ogodDefineActorReactive(tagName, 'resource', ogodHybridResource(), stateHybrids, overrideHybrids,
        OGOD_DEFAULT_KEYS.concat(['path']).concat(additionalKeys), resourceInit, null, resourceDestroy);
}

export function ogodDefineResources(tagName: string = 'ogod-resources', stateHybrids?: Hybrids<any>[],
    overrideHybrids?: Hybrids<any>[], additionalKeys: string[] = []) {
    return ogodDefineActorReactive(tagName, 'resource', ogodHybridResources(), stateHybrids, overrideHybrids,
        OGOD_DEFAULT_KEYS.concat(['paths']).concat(additionalKeys), resourceInit, null, resourceDestroy);
}
