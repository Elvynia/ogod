import { OgodCategoryState, OgodStateReactive } from '@ogod/common';
import { OgodElementActor } from "../actor/element";

export interface OgodElementReactive<C extends string> extends OgodElementActor<C> {
    active: boolean;
    tick: boolean;
    bindings: string;
    updates: string[];
    watches: string[];
    reflects: string[];
}
