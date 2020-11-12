import { Observable } from 'rxjs';
import { OgodStateEngine, OgodStateActor, OgodActionActor, OgodCategoryState } from '@ogod/common';

export interface OgodRuntimeActor<S extends OgodStateActor<C>, A extends OgodActionActor<S>, C extends keyof OgodCategoryState = S['category']> {
    initialize(state: S, state$: Observable<OgodStateEngine>): Observable<A>;
    destroy(state: S): Observable<A>;
}
