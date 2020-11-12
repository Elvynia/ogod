import { Hybrids } from 'hybrids';
import { OgodElementActor } from "./element";
import { OgodCategoryState, ActionCreator } from "@ogod/common";
export declare function ogodDefineActorReactive<E extends OgodElementActor<C>, C extends keyof OgodCategoryState>(tagName: string, category: C, baseHybrid: Hybrids<OgodElementActor<C>>, stateHybrids: Hybrids<any>[], overrideHybrids: Hybrids<any>[], defaultKeys: string[], initCreator: ActionCreator, changesCreator: ActionCreator, destroyCreator: ActionCreator, active?: boolean): hybrids.HybridElement<E>;
export declare function ogodDefineActorAsync<E extends HTMLElement, S = any>(tagName: string, baseHybrid: Hybrids<any>, stateHybrids?: Hybrids<any>[], overrideHybrids?: Hybrids<any>[]): hybrids.HybridElement<E>;
