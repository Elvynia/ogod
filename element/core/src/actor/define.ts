import { Hybrids } from 'hybrids';
import { ogodDefineElement } from "../define";
import { OgodElementActor } from "./element";
import { OgodCategoryState, ActionCreator } from "@ogod/common";
import { ogodHybridStateAsync } from '../state/async/hybrid';
import { ogodHybridStateReactive } from '../state/reactive/hybrid';
import { ogodHybridReactive } from '../reactive/hybrid';
import { ogodHybridActor } from './hybrid';

export function ogodDefineActorReactive<E extends OgodElementActor<C>, C extends keyof OgodCategoryState>(tagName: string, category: C,
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
