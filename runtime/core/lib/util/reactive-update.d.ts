import { OgodRuntimeReactive } from '../reactive/runtime';
import { OgodStateReactive, OgodActionReactive, OgodCategoryState } from '@ogod/common';
import { Subscription } from 'rxjs';
export declare function ogodReactiveUpdate<S extends OgodStateReactive<C>, A extends OgodActionReactive<S>, C extends keyof OgodCategoryState = S['category']>(runtime: OgodRuntimeReactive<S, A>, state: S): Subscription;
