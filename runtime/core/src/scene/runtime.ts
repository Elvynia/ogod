import {
    OgodActionActor,
    OgodActionScene, OgodStateEngine,
    OgodStateInstance, OgodStateScene, OGOD_CATEGORY, sceneChangesSuccess, sceneDestroySuccess,
    sceneInitSuccess,
    sceneStart,
    sceneStop
} from '@ogod/common';
import { ActionsObservable } from 'redux-observable';
import { Observable, of } from 'rxjs';
import { delay, filter, first, map, mapTo, pluck, withLatestFrom } from 'rxjs/operators';
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

    start(state: OgodStateScene, state$: Observable<OgodStateEngine>): OgodActionActor<OgodStateScene> {
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
        return sceneStart({ id: state.id, state });
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
        state.entities.splice(state.entities.findIndex((key) => key === id), 1);
    }

    stop(state: OgodStateScene): OgodActionActor<OgodStateScene> {
        console.log('[SCENE] Stop', state.id);
        state.running = false;
        state.entities = [];
        Object.values(state.sub$).forEach((sub) => sub.unsubscribe());
        return sceneStop({ id: state.id, state });
    }

    destroy(state: OgodStateScene, state$: Observable<OgodStateEngine>): Observable<OgodActionScene> {
        state.active = false;
        return state$.pipe(
            map((fs) => fs[OGOD_CATEGORY.SCENE][state.id]),
            filter((s) => !s.running),
            first(),
            mapTo(sceneDestroySuccess({
                id: state.id
            }))
        );
    }
}
