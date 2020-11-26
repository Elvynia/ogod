import { OgodStateInstance, OgodStateContainer, OgodActionActor, OgodCategoryState } from '@ogod/common';
import { OgodRuntimeReactive } from '../reactive/runtime';

export interface OgodRuntimeContainer<S extends OgodStateContainer<C>, A extends OgodActionActor<S>, C extends string = S['category']>
    extends OgodRuntimeReactive<S, A> {
    add(state: S, child: OgodStateInstance): void;
    remove(state: S, id: string, child: OgodStateInstance): void;
}
