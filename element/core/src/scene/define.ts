import { Hybrids } from 'hybrids';
import { ogodDefineActorReactive } from '../actor/define';
import { ogodHybridScene } from "./hybrid";
import { OGOD_DEFAULT_KEYS } from '../constants';
import { sceneInit, sceneChanges, sceneDestroy } from '@ogod/common';

export function ogodDefineScene(tagName: string = 'ogod-scene', stateHybrids?: Hybrids<any>[], overrideHybrids?: Hybrids<any>[]) {
    return ogodDefineActorReactive(tagName, 'scene', ogodHybridScene(), stateHybrids, overrideHybrids,
        OGOD_DEFAULT_KEYS, sceneInit, sceneChanges, sceneDestroy, false);
}
