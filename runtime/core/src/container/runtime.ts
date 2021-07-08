import { OgodActionActor, OgodStateContainer, OgodStateEngine, OgodStateInstance } from '@ogod/common';
import { Observable } from 'rxjs';
import { filter, map, pluck, withLatestFrom } from 'rxjs/operators';
import { OgodRuntimeEngine } from '../engine/runtime';
import { OgodRuntimeReactive } from '../reactive/runtime';

declare var self: OgodRuntimeEngine;

export interface OgodRuntimeContainer<S extends OgodStateContainer<C>, A extends OgodActionActor<S>, C extends string = S['category']>
    extends OgodRuntimeReactive<S, A> {
    add(state: S, child: OgodStateInstance): void;
    remove(state: S, id: string, child: OgodStateInstance): void;
}

export function ogodContainerUpdate$(filterInstances: (source: Observable<[number, OgodStateInstance[]]>) => Observable<OgodStateInstance[]>,
    state: OgodStateContainer<any>, state$: Observable<OgodStateEngine>) {
    return self.update$.pipe(
        withLatestFrom(state$.pipe(
            pluck('instance'),
            map((instances) => state.acceptUnloaded ? Object.values(instances) : Object.values(instances)
                .filter((instance) => instance.loaded && instance.running)
            )
        )),
        filterInstances,
        map((instances: OgodStateInstance[]) => {
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
    )
}
