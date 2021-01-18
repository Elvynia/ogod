import { ActionCreator } from "@ogod/common";
import { Hybrids } from 'hybrids';
import { ogodDefineElement } from "../define";
import { ogodHybridReactive } from '../reactive/hybrid';
import { ogodHybridStateAsync } from '../state/async/hybrid';
import { ogodHybridStateReactive } from '../state/reactive/hybrid';
import { OgodElementActor } from "./element";
import { ogodHybridActor } from './hybrid';

export function ogodDefineActorReactive<E extends OgodElementActor<C>, C extends string>(tagName: string, category: C,
    baseHybrid: Hybrids<OgodElementActor<C>>, stateHybrids: Hybrids<any>[] = [], overrideHybrids: Hybrids<any>[] = [],
    defaultKeys: string[], initCreator: ActionCreator, changesCreator: ActionCreator,
    destroyCreator: ActionCreator, active: boolean = true): hybrids.HybridElement<E> {
    return ogodDefineElement(tagName, baseHybrid,
        changesCreator ? [ogodHybridActor(category), ...stateHybrids, ogodHybridReactive<C>(changesCreator, active)] :
            [ogodHybridActor(category), ...stateHybrids],
        [...overrideHybrids, ogodHybridStateReactive<C>(defaultKeys, initCreator, destroyCreator)]);
}

export function ogodDefineActorAsync<E extends HTMLElement, S = any>(tagName: string,
    baseHybrid: Hybrids<any>, stateHybrids: Hybrids<any>[] = [], overrideHybrids: Hybrids<any>[] = []): hybrids.HybridElement<E> {
    return ogodDefineElement(tagName, baseHybrid, stateHybrids,
        [...overrideHybrids, ogodHybridStateAsync<S>()]);
}
