import { Subscription, from } from "rxjs";
import { OgodStateReactive, OgodStateEngine } from "@ogod/common";
import { withLatestFrom, pluck, map, filter, mergeMap, tap } from "rxjs/operators";
import { OgodRuntimeEngine } from "../engine/runtime";
import { OgodCategoryRuntime } from "./category";
import { OgodRuntimeReactive } from "../reactive/runtime";

declare var self: OgodRuntimeEngine;

export function watchReactiveStates<C extends keyof OgodCategoryRuntime>(category: C): Subscription {
    return self.update$.pipe(
        withLatestFrom(self.state$.pipe(
            pluck<OgodStateEngine, { [id: string]: OgodStateReactive<C> }>(category),
            map((children) => Object.values(children).filter((child) => child.loaded))
        )),
        map(([delta, children]) => children
            .filter((child) => child.active && !child.running || !child.active && child.running)
            .map((child) => ({ active: child.active, running: child.running, id: child.id }))
        ),
        filter((children) => children.length > 0),
        mergeMap((children) => from(children))
    ).subscribe(({ active, running, id }) => {
        const runtime: OgodRuntimeReactive<any, any, C> = self.runtimes[category][id] as any;
        const state = self.store.getState()[category][id];
        if (active && !running) {
            runtime.start(state, self.state$);
        } else {
            runtime.stop(state);
        }
    });
}
