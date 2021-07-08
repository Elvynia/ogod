import { OgodActionActor, OgodActionSystem, OgodStateEngine, OgodStateInstance, OgodStateSystem, OGOD_CATEGORY, systemChangesSuccess, systemDestroySuccess, systemInitSuccess, systemStart, systemStop } from '@ogod/common';
import { ActionsObservable } from 'redux-observable';
import { Observable, of } from 'rxjs';
import { filter, first, map, mapTo } from 'rxjs/operators';
import { ogodContainerUpdate$, OgodRuntimeContainer } from '../container/runtime';
import { OgodRuntimeEngine } from '../engine/runtime';
import { ogodReactiveUpdate } from '../util/reactive-update';

declare var self: OgodRuntimeEngine;

export interface OgodRuntimeSystem extends OgodRuntimeContainer<OgodStateSystem, OgodActionSystem> {
    filter(state: OgodStateSystem, instances: Array<OgodStateInstance>): Array<OgodStateInstance>;
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

export function ogodContainerUpdateSystem$(runtime: OgodRuntimeSystem, state: OgodStateSystem, state$: Observable<OgodStateEngine>) {
    return ogodContainerUpdate$((source: Observable<[number, OgodStateInstance[]]>) => source.pipe(
        map(([delta, instances]) => runtime.filter(state, instances))
    ), state, state$);
}

export class OgodRuntimeSystemDefault implements OgodRuntimeSystem {

    initialize(state: OgodStateSystem, state$: Observable<OgodStateEngine>, action$: ActionsObservable<any>): Observable<OgodActionSystem> {
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

    start(state: OgodStateSystem, state$: Observable<OgodStateEngine>): OgodActionActor<OgodStateSystem> {
        console.log('[SYSTEM] Start', state.id);
        state.running = true;
        if (state.aspects) {
            state.sub$['ogodContainerUpdate'] = ogodContainerUpdateSystem$(this, state, state$).subscribe(({ added, removed }) => {
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
        return systemStart({ id: state.id, state });
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
        console.log('[SYSTEM] Remove %s from %s', id, state.id);
        state.entities.splice(state.entities.findIndex((key) => key === id), 1);
    }

    stop(state: OgodStateSystem): OgodActionActor<OgodStateSystem> {
        console.log('[SYSTEM] Stop', state.id);
        state.running = false;
        state.entities = [];
        Object.values(state.sub$).forEach((sub) => sub.unsubscribe());
        return systemStop({ id: state.id, state });
    }

    destroy(state: OgodStateSystem, state$: Observable<OgodStateEngine>): Observable<OgodActionSystem> {
        state.active = false;
        return state$.pipe(
            map((fs) => fs[OGOD_CATEGORY.SYSTEM][state.id]),
            filter((s) => !s.running),
            first(),
            mapTo(systemDestroySuccess({
                id: state.id
            }))
        );
    }

    filter(state: OgodStateSystem, instances: Array<OgodStateInstance>): Array<OgodStateInstance> {
        if (state.mode === 'all') {
            return instances.filter(ogodAspectAll(state.aspects));
        }
        return instances.filter(ogodAspectAny(state.aspects));
    }
}
