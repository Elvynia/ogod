import { Observable } from 'rxjs';
import { OgodStateEngine, OgodStateReactive, OgodActionReactive, OgodCategoryState } from '@ogod/common';
import { OgodRuntimeActor } from '../actor/runtime';

export interface OgodRuntimeReactive<S extends OgodStateReactive<C>, A extends OgodActionReactive<S>, C extends keyof OgodCategoryState = S['category']>
    extends OgodRuntimeActor<S, A> {
    start(state: S, state$: Observable<OgodStateEngine>);
    changes(changes: Partial<S>, state: S): Observable<A>;
    stop(state: S);
    update?(delta: number, state: S);
}
