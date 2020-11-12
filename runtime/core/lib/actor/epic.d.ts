import { Epic } from "redux-observable";
import { OgodStateEngine, OgodActionReactive, OgodStateReactive, OgodActionActor, OgodStateActor } from '@ogod/common';
import { OgodCategoryRuntime } from "../util/category";
export declare function ogodEpicActorInit<S extends OgodStateActor<C>, A extends OgodActionActor<S, C>, C extends keyof OgodCategoryRuntime = S['category']>(category: C, postInit?: Function): Epic<A, A, OgodStateEngine>;
export declare function ogodEpicActorChanges<S extends OgodStateReactive<C>, A extends OgodActionReactive<S>, C extends keyof OgodCategoryRuntime = S['category']>(category: C): Epic<A, A, OgodStateEngine>;
export declare function ogodEpicActorDestroy<C extends keyof OgodCategoryRuntime, S extends OgodStateReactive<C>, A extends OgodActionReactive<S>>(category: C): Epic<A, A, OgodStateEngine>;
