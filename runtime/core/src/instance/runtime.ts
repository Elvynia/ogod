import {
    instanceChangesSuccess, instanceDestroySuccess, instanceInitSuccess, OgodActionInstance,
    OgodStateEngine, OgodStateInstance
} from "@ogod/common";
import { Observable, of } from "rxjs";
import { ogodReactiveUpdate } from '../util/reactive-update';
import { OgodRuntimeEngine } from "../engine/runtime";
import { OgodRuntimeReactive } from "../reactive/runtime";

declare var self: OgodRuntimeEngine;

export interface OgodRuntimeInstance extends OgodRuntimeReactive<OgodStateInstance, OgodActionInstance> {
}

export abstract class OgodRuntimeInstanceDefault implements OgodRuntimeInstance {

    initialize(state: OgodStateInstance, state$: Observable<OgodStateEngine>): Observable<OgodActionInstance> {
        return of(instanceInitSuccess({
            id: state.id,
            state: {
                ...state,
                scenes: state.scenes || [],
                sub$: new Array(),
                loading: false,
                loaded: true
            }
        }));
    }

    start(state: OgodStateInstance, state$: Observable<OgodStateEngine>) {
        console.log('[INSTANCE] Start', state.id);
        state.running = true;
        state.sub$.push(ogodReactiveUpdate(this, state));
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
        state.sub$.forEach((sub) => sub.unsubscribe());
    }

    destroy({ id }: OgodStateInstance): Observable<OgodActionInstance> {
        return of(instanceDestroySuccess({
            id
        }));
    }
}