import { empty } from 'rxjs';
import { Epic, ofType } from "redux-observable";
import { filter, map, mergeMap, take } from 'rxjs/operators';
import {
    OgodStateEngine, OgodActionReactive, OgodStateReactive, ogodActionName,
    OgodActionActor, OGOD_ACTION_ACTOR, OgodStateActor
} from '@ogod/common';
import { OgodRuntimeEngine } from "../engine/runtime";
import { OgodCategoryRuntime } from "../util/category";
import { OgodRuntimeActor } from "./runtime";
import { OgodRuntimeReactive } from "../reactive/runtime";

declare var self: OgodRuntimeEngine;

export function ogodEpicActorInit<S extends OgodStateActor<C>, A extends OgodActionActor<S, C>, C extends keyof OgodCategoryRuntime = S['category']>(
    category: C, postInit?: Function): Epic<A, A, OgodStateEngine> {
    return (action$, state$) => action$.pipe(
        ofType(ogodActionName(category, OGOD_ACTION_ACTOR.INIT)),
        mergeMap(({ state }) => {
            if (self.registry.hasRuntime(state.category, state.runtime)) {
                const runtime: OgodRuntimeActor<S, A> = self.registry.createRuntime(state.category, state.runtime);
                Object.assign(self.runtimes[category], { [state.id]: runtime });
                if (postInit) {
                    postInit(state, runtime);
                }
                return runtime.initialize(state, state$);
            } else {
                console.error('[OGOD][instance] Cannot find runtime %s.%s in registry to initialize.', state.category, state.runtime);
            }
            // FIXME: instanceInitError
            return empty();
        })
    );
}

export function ogodEpicActorChanges<S extends OgodStateReactive<C>, A extends OgodActionReactive<S>, C extends keyof OgodCategoryRuntime = S['category']>(category: C): Epic<A, A, OgodStateEngine> {
    return (action$, state$) => action$.pipe(
        ofType(ogodActionName(category, OGOD_ACTION_ACTOR.CHANGES)),
        mergeMap(({ id, changes }) => state$.pipe(
            filter((state) => {
                const test = state[category]
                return state[category][id] && state[category][id].loaded
            }),
            map((state) => ({
                id,
                changes,
                state: state[category][id]
            })),
            take(1)
        )),
        mergeMap(({ id, changes, state }) => {
            const runtime: OgodRuntimeReactive<S, A> = self.runtimes[category][id] as any;
            return runtime.changes(changes, state as any as S);
        })
    );
}

export function ogodEpicActorDestroy<C extends keyof OgodCategoryRuntime, S extends OgodStateReactive<C>, A extends OgodActionReactive<S>>(category: C): Epic<A, A, OgodStateEngine> {
    return (actions$, state$) => actions$.pipe(
        ofType(ogodActionName(category, OGOD_ACTION_ACTOR.DESTROY)),
        mergeMap(({ id }) => state$.pipe(
            map((state) => state[category][id]),
            take(1)
        )),
        mergeMap((state) => {
            const runtime: OgodRuntimeActor<S, A> = self.runtimes[category][state.id] as any;
            return runtime.destroy(state as any as S);
        })
    );
}