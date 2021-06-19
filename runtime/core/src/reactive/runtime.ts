import { Observable } from 'rxjs';
import { OgodStateEngine, OgodStateReactive, OgodActionActor, OgodCategoryState } from '@ogod/common';
import { OgodRuntimeActor } from '../actor/runtime';

export interface OgodRuntimeReactive<S extends OgodStateReactive<C>, A extends OgodActionActor<S>, C extends string = S['category']>
    extends OgodRuntimeActor<S, A> {
    start(state: S, state$: Observable<OgodStateEngine>): A;
    stop(state: S): A;
    update?(delta: number, state: S);
}
