import { OgodCategoryState } from '@ogod/common';
import { OgodElementActor } from "../actor/element";
export interface OgodElementReactive<C extends keyof OgodCategoryState> extends OgodElementActor<C> {
    active: boolean;
    tick: boolean;
    updates: string[];
    reflects: string[];
}
