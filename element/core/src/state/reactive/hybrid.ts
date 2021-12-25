import { OgodActionCreator } from "@ogod/common";
import { Hybrids } from 'hybrids';
import { ogodFactoryInitialize$ } from "../../factory/initialize";
import { ogodFactoryState } from "../../factory/state";
import { ogodFactoryState$ } from "../../factory/state-observable";
import { OgodElementState } from './element';

export function ogodHybridStateReactive<C extends string>(
    defaultKeys: string[], initCreator: OgodActionCreator, destroyCreator: OgodActionCreator): Hybrids<OgodElementState<C>> {
    return {
        initialize$: ogodFactoryInitialize$(),
        state$: ogodFactoryState$(),
        state: ogodFactoryState(defaultKeys, initCreator, destroyCreator)
    };
}
