import { OgodStateInstance, OgodStateContainer, OgodActionReactive, OgodCategoryState } from '@ogod/common';
import { OgodRuntimeReactive } from '../reactive/runtime';

export interface OgodRuntimeContainer<S extends OgodStateContainer<C>, A extends OgodActionReactive<S>, C extends keyof OgodCategoryState = S['category']>
    extends OgodRuntimeReactive<S, A> {
    add(state: S, child: OgodStateInstance): void;
    remove(state: S, id: string, child: OgodStateInstance): void;
}
