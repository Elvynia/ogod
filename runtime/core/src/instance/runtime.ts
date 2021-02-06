import {
    instanceChangesSuccess, instanceDestroySuccess, instanceInitSuccess, OgodActionInstance,
    OgodStateEngine, OgodStateInstance
} from "@ogod/common";
import { ActionsObservable } from "redux-observable";
import { Observable, of } from "rxjs";
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

    start(state: OgodStateInstance, state$: Observable<OgodStateEngine>) {
        console.log('[INSTANCE] Start', state.id);
        state.running = true;
        state.sub$['ogodReactiveUpdate'] = ogodReactiveUpdate(this, state);
    }

    changes(changes: Partial<OgodStateInstance>, state: OgodStateInstance): Observable<OgodActionInstance> {
        return of(instanceChangesSuccess({
            id: state.id,
            changes
        }));
    }

    stop(state: OgodStateInstance) {
        console.log('[INSTANCE] Stop', state.id);
        state.running = false;
        Object.values(state.sub$).forEach((sub) => sub.unsubscribe());
    }

    destroy({ id }: OgodStateInstance): Observable<OgodActionInstance> {
        return of(instanceDestroySuccess({
            id
        }));
    }
}
