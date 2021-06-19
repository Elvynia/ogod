import {
    OgodActionActor, ogodActionName,
    OgodStateActor, OgodStateEngine, OgodStateReactive,
    OGOD_ACTION_ACTOR
} from '@ogod/common';
import { Epic, ofType } from "redux-observable";
import { empty } from 'rxjs';
import { delay, filter, map, mergeMap, take } from 'rxjs/operators';
import { OgodRuntimeEngine } from "../engine/runtime";
import { OgodRuntimeReactive } from "../reactive/runtime";
import { OgodRuntimeActor } from "./runtime";

declare var self: OgodRuntimeEngine;

export function ogodEpicActorInit<S extends OgodStateActor<C>, A extends OgodActionActor<S, C>, C extends string = S['category']>(
    category: C): Epic<A, A, OgodStateEngine> {
    return (action$, state$) => action$.pipe(
        ofType(ogodActionName(category, OGOD_ACTION_ACTOR.INIT)),
        mergeMap(({ state }) => {
            if (self.registry.hasRuntime(state.category, state.runtime)) {
                const runtime: OgodRuntimeActor<S, A> = self.registry.createActorRuntime(state.category, state.runtime);
                Object.assign(self.runtimes[category], { [state.id]: runtime });
                return runtime.initialize(state, state$, action$);
            } else {
                console.error('[OGOD][instance] Cannot find runtime %s.%s in registry to initialize.', state.category, state.runtime);
            }
            // FIXME: instanceInitError
            return empty();
        })
    );
}

export function ogodEpicActorChanges<S extends OgodStateReactive<string>, A extends OgodActionActor<S>>(category: string): Epic<A, A, OgodStateEngine> {
    return (action$, state$) => action$.pipe(
        ofType(ogodActionName(category, OGOD_ACTION_ACTOR.CHANGES)),
        mergeMap(({ id, changes }) => state$.pipe(
            filter((state) => state[category][id]),
            map((state) => ({
                id,
                changes,
                state: state[category][id]
            })),
            take(1)
        )),
        mergeMap(({ id, changes, state }) => {
            const runtime = self.getRuntime<OgodRuntimeReactive<S, A>>(category, id);
            return runtime.changes(changes, state);
        })
    );
}

export function ogodEpicActorDestroy<S extends OgodStateReactive<string>, A extends OgodActionActor<S>>(category: string): Epic<A, A, OgodStateEngine> {
    return (actions$, state$) => actions$.pipe(
        ofType(ogodActionName(category, OGOD_ACTION_ACTOR.DESTROY)),
        mergeMap(({ id }) => state$.pipe(
            map((state) => state[category][id]),
            filter((state) => state.destroying),
            take(1)
        )),
        mergeMap((state) => {
            const runtime = self.getRuntime<OgodRuntimeReactive<S, A>>(category, state.id);
            return runtime.destroy(state, state$);
        })
    );
}
