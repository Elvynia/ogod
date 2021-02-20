import {
    OgodActionScene, OgodStateEngine,
    OgodStateInstance, OgodStateScene, sceneChangesSuccess, sceneDestroySuccess,
    sceneInitSuccess
} from '@ogod/common';
import { ActionsObservable } from 'redux-observable';
import { Observable, of } from 'rxjs';
import { filter, map, pluck, withLatestFrom } from 'rxjs/operators';
import { OgodRuntimeEngine } from '../engine/runtime';
import { ogodReactiveUpdate } from '../util/reactive-update';
import { OgodRuntimeContainer } from './../container/runtime';

declare var self: OgodRuntimeEngine;

export interface OgodRuntimeScene extends OgodRuntimeContainer<OgodStateScene, OgodActionScene> {
    render(state: OgodStateScene): void;
}

export abstract class OgodRuntimeSceneDefault implements OgodRuntimeScene {

    initialize(state: OgodStateScene, state$: Observable<OgodStateEngine>, action$: ActionsObservable<any>): Observable<OgodActionScene> {
        return of(sceneInitSuccess({
            id: state.id,
            state: {
                ...state,
                entities: state.entities || [],
                sub$: {},
                loading: false,
                loaded: true
            }
        }));
    }

    abstract render(state: OgodStateScene): void;

    start(state: OgodStateScene, state$: Observable<OgodStateEngine>) {
        console.log('[SCENE] Start', state.id);
        state.running = true;
        state.sub$['ogodContainerUpdate'] = self.update$.pipe(
            withLatestFrom(state$.pipe(
                pluck('instance'),
                map((instances) => Object.values(instances)
                    .filter((instance) => instance.loaded))
            )),
            map(([delta, instances]) => instances
                .filter((instance: OgodStateInstance) => instance.running && instance.scenes.indexOf(state.id) >= 0)
            ),
            map((instances) => {
                const added = instances
                    .filter((i) => state.entities.indexOf(i.id) < 0);
                const removed = state.entities
                    .filter((id) => instances.findIndex((i) => i.id === id) < 0);
                return {
                    added,
                    removed
                }
            }),
            filter(({ added, removed }) => added.length > 0 || removed.length > 0)
        ).subscribe(({ added, removed }) => {
            added.forEach((instance: OgodStateInstance) => {
                this.add(state, instance);
            });
            removed.forEach((id) => {
                const instance = self.store.getState().instance[id] as OgodStateInstance;
                this.remove(state, id, instance);
            });
        });
        state.sub$['ogodReactiveUpdate'] = ogodReactiveUpdate(this, state);
    }

    add(state: OgodStateScene, child: OgodStateInstance): void {
        console.log('[SCENE] Add %s to %s', child.id, state.id);
        state.entities.push(child.id);
    }

    changes(changes: Partial<OgodStateScene>, state: OgodStateScene): Observable<OgodActionScene> {
        return of(sceneChangesSuccess({
            id: state.id,
            changes
        }));
    }

    remove(state: OgodStateScene, id: string, child: OgodStateInstance): void {
        console.log('[SCENE] Remove %s from %s', id, state.id);
        state.entities = state.entities.filter((childId) => id !== childId);
    }

    stop(state: OgodStateScene) {
        console.log('[SCENE] Stop', state.id);
        state.running = false;
        state.entities = [];
        Object.values(state.sub$).forEach((sub) => sub.unsubscribe());
    }

    destroy(state: OgodStateScene): Observable<OgodActionScene> {
        if (state.running) {
            state.active = false;
            this.stop(state);
        }
        return of(sceneDestroySuccess({
            id: state.id
        }));
    }
}
