import { OgodStateEngine, OgodStateSystem, OgodActionSystem, systemInitSuccess, systemChangesSuccess, systemDestroySuccess, OgodStateInstance } from '@ogod/common';
import { Observable, of } from 'rxjs';
import { OgodRuntimeContainer } from '../container/runtime';
import { OgodRuntimeEngine } from '../engine/runtime';
import { withLatestFrom, pluck, map, filter } from 'rxjs/operators';
import { ogodReactiveUpdate } from '../util/reactive-update';

declare var self: OgodRuntimeEngine;

export interface OgodRuntimeSystem extends OgodRuntimeContainer<OgodStateSystem, OgodActionSystem> {
}

export function ogodAspectAny(aspects) {
    return (instance: OgodStateInstance): boolean => aspects.some((key) => Object.entries(instance)
        .filter(([k, value]) => value !== undefined)
        .map(([k]) => k)
        .indexOf(key) >= 0);
}

export function ogodAspectAll(aspects) {
    return (instance: OgodStateInstance): boolean => aspects.every((key) => Object.entries(instance)
        .filter(([k, value]) => value !== undefined)
        .map(([k]) => k)
        .indexOf(key) >= 0);
}

export class OgodRuntimeSystemDefault implements OgodRuntimeSystem {

    initialize(state: OgodStateSystem, state$: Observable<OgodStateEngine>): Observable<OgodActionSystem> {
        return of(systemInitSuccess({
            id: state.id,
            state: {
                ...state,
                entities: [],
                sub$: {},
                loading: false,
                loaded: true,
            }
        }));
    }

    start(state: OgodStateSystem, state$: Observable<OgodStateEngine>) {
        console.log('[SYSTEM] Start', state.id);
        state.running = true;
        if (state.aspects) {
            state.sub$['ogodContainerUpdate'] = self.update$.pipe(
                withLatestFrom(state$.pipe(
                    pluck('instance'),
                    map((instances) => Object.values(instances)
                        .filter((instance) => instance.loaded)
                    )
                )),
                // FIXME: instance running filter
                map(([delta, instances]) => this.filter(state, instances)),
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
                added.forEach((instance) => {
                    this.add(state, instance);
                });
                removed.forEach((id) => {
                    const instance = self.store.getState().instance[id];
                    this.remove(state, id, instance);
                });
            });
        }
        state.sub$['ogodReactiveUpdate'] = ogodReactiveUpdate(this, state);
    }

    add(state: OgodStateSystem, child: OgodStateInstance) {
        console.log('[SYSTEM] Add %s to %s', child.id, state.id);
        state.entities.push(child.id);
    }

    changes(changes: Partial<OgodStateSystem>, state: OgodStateSystem): Observable<OgodActionSystem> {
        return of(systemChangesSuccess({
            id: state.id,
            changes
        }));
    }

    remove(state: OgodStateSystem, id: string, child: OgodStateInstance) {
        console.log('[SYSTEM] Remove %s from %s', child.id, state.id);
        state.entities = state.entities.filter((childId) => id !== childId);
    }

    stop(state: OgodStateSystem) {
        console.log('[SYSTEM] Stop', state.id);
        state.running = false;
        state.entities = [];
        Object.values(state.sub$).forEach((sub) => sub.unsubscribe());
    }

    destroy({ id }: OgodStateSystem): Observable<OgodActionSystem> {
        return of(systemDestroySuccess({
            id
        }));
    }

    protected filter(state: OgodStateSystem, instances: Array<OgodStateInstance>): Array<OgodStateInstance> {
        if (state.mode === 'all') {
            return instances.filter(ogodAspectAll(state.aspects));
        }
        return instances.filter(ogodAspectAny(state.aspects));
    }
}
