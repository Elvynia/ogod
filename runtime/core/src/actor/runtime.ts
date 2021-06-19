import { Observable } from 'rxjs';
import { OgodStateEngine, OgodStateActor, OgodActionActor } from '@ogod/common';
import { ActionsObservable } from 'redux-observable';

export interface OgodRuntimeActor<S extends OgodStateActor<C>, A extends OgodActionActor<S>, C extends string = S['category']> {
    initialize(state: S, state$: Observable<OgodStateEngine>, action$: ActionsObservable<any>): Observable<A>;
    destroy(state: S, state$?: Observable<OgodStateEngine>): Observable<A>;
    changes(changes: Partial<S>, state: S): Observable<A>;
}
