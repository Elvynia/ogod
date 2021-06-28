import {
    instanceChangesSuccess, instanceDestroySuccess, instanceInitSuccess, OgodActionActor, OgodActionInstance,
    OgodStateEngine, OgodStateInstance, OGOD_CATEGORY, instanceStart, instanceStop
} from "@ogod/common";
import { ActionsObservable } from "redux-observable";
import { Observable, of } from "rxjs";
import { delay, filter, first, map, mapTo, tap } from "rxjs/operators";
import { OgodRuntimeReactive } from "../reactive/runtime";
import { ogodReactiveUpdate } from '../util/reactive-update';

export interface OgodRuntimeInstance extends OgodRuntimeReactive<OgodStateInstance, OgodActionInstance> {
}

export abstract class OgodRuntimeInstanceDefault implements OgodRuntimeInstance {

    initialize(state: OgodStateInstance, state$: Observable<OgodStateEngine>, action$: ActionsObservable<any>): Observable<OgodActionInstance> {
        return this.initializeSuccess(state);
    }

    initializeSuccess(state: OgodStateInstance): Observable<OgodActionInstance> {
        return of(instanceInitSuccess({
            id: state.id,
            state: {
                ...state,
                scenes: state.scenes || [],
                sub$: {},
                loading: false,
                loaded: true
            }
        }));
    }

    start(state: OgodStateInstance, state$: Observable<OgodStateEngine>): OgodActionActor<OgodStateInstance> {
        console.log('[INSTANCE] Start', state.id);
        state.running = true;
        state.sub$['ogodReactiveUpdate'] = ogodReactiveUpdate(this, state);
        return instanceStart({ id: state.id, state });
    }

    changes(changes: Partial<OgodStateInstance>, state: OgodStateInstance): Observable<OgodActionInstance> {
        return this.changesSuccess(changes, state);
    }

    changesSuccess(changes: Partial<OgodStateInstance>, state: OgodStateInstance): Observable<OgodActionInstance> {
        return of(instanceChangesSuccess({
            id: state.id,
            changes
        }));
    }

    stop(state: OgodStateInstance): OgodActionActor<OgodStateInstance> {
        console.log('[INSTANCE] Stop', state.id);
        state.running = false;
        Object.values(state.sub$).forEach((sub) => sub.unsubscribe());
        return instanceStop({ id: state.id, state });
    }

    destroy(state: OgodStateInstance, state$: Observable<OgodStateEngine>): Observable<OgodActionInstance> {
        state.active = false;
        return state$.pipe(
            map((fs) => fs[OGOD_CATEGORY.INSTANCE][state.id]),
            filter((s) => !s.running),
            first(),
            tap((s) => s.sub$ = null),
            filter((s) => !Object.entries(s).some(([key, value]) => key.endsWith('$') && value != null)),
            mapTo(instanceDestroySuccess({
                id: state.id
            }))
        );
    }
}
