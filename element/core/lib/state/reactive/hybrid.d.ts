import { Hybrids } from 'hybrids';
import { ActionCreator, OgodCategoryState } from "@ogod/common";
import { OgodElementState } from './element';
export declare function ogodHybridStateReactive<C extends keyof OgodCategoryState>(defaultKeys: string[], initCreator: ActionCreator, destroyCreator: ActionCreator): Hybrids<OgodElementState<C>>;
