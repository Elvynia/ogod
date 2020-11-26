import { from, Subscription } from "rxjs";
import { filter, map, mergeMap, pluck, withLatestFrom } from "rxjs/operators";
import { OgodRuntimeEngine } from "../engine/runtime";
import { OgodRuntimeReactive } from "../reactive/runtime";

declare var self: OgodRuntimeEngine;

export function watchReactiveStates(category: string): Subscription {
    return self.update$.pipe(
        withLatestFrom(self.state$.pipe(
            pluck(category),
            map((children) => Object.values(children).filter((child) => child.loaded))
        )),
        map(([delta, children]) => children
            .filter((child) => child.active && !child.running || !child.active && child.running)
            .map((child) => ({ active: child.active, running: child.running, id: child.id }))
        ),
        filter((children) => children.length > 0),
        mergeMap((children) => from(children))
    ).subscribe(({ active, running, id }) => {
        const runtime: OgodRuntimeReactive<any, any> = self.getRuntime(category, id);
        const state = self.store.getState()[category][id];
        if (active && !running) {
            runtime.start(state, self.state$);
        } else {
            runtime.stop(state);
        }
    });
}
