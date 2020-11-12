import { Hybrids } from 'hybrids';
import { ogodFactoryState$ } from "../../factory/state-observable";
import { ogodFactoryState } from "../../factory/state";
import { ogodFactoryInitialize$ } from "../../factory/initialize";
import { ActionCreator, OgodCategoryState } from "@ogod/common";
import { OgodElementState } from './element';

export function ogodHybridStateReactive<C extends keyof OgodCategoryState>(
    defaultKeys: string[], initCreator: ActionCreator, destroyCreator: ActionCreator): Hybrids<OgodElementState<C>> {
    return {
        initialize$: ogodFactoryInitialize$(),
        state$: ogodFactoryState$(),
        state: ogodFactoryState(defaultKeys, initCreator, destroyCreator)
    };
}