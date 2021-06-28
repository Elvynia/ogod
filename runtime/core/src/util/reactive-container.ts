import { OgodStateEngine, OgodStateSystem } from '@ogod/common';
import { Observable } from 'rxjs';
import { filter, map, pluck, withLatestFrom } from 'rxjs/operators';
import { OgodRuntimeEngine } from '../engine/runtime';
import { OgodRuntimeSystem } from '../system/runtime';


declare var self: OgodRuntimeEngine;

export function ogodContainerUpdate$(runtime: OgodRuntimeSystem, state: OgodStateSystem, state$: Observable<OgodStateEngine>) {
    return self.update$.pipe(
        withLatestFrom(state$.pipe(
            pluck('instance'),
            map((instances) => state.acceptUnloaded ? Object.values(instances) : Object.values(instances)
                .filter((instance) => instance.loaded && instance.running)
            )
        )),
        map(([delta, instances]) => runtime.filter(state, instances)),
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
    )
}
