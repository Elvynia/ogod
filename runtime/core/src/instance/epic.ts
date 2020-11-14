import { instanceDestroy, OgodStateEngine, OGOD_CATEGORY, OgodStateInstance } from "@ogod/common";
import { ofType, Epic } from 'redux-observable';
import { Observable } from 'rxjs';
import { map, mergeMap, take, filter } from 'rxjs/operators';
import { ogodEpicActorChanges, ogodEpicActorInit } from '../actor/epic';
import { OgodRuntimeInstance } from "./runtime";
import { OgodRuntimeEngine } from "../engine/runtime";

declare var self: OgodRuntimeEngine;

export const epicInstanceInit = ogodEpicActorInit(OGOD_CATEGORY.INSTANCE);
export const epicInstanceChanges = ogodEpicActorChanges(OGOD_CATEGORY.INSTANCE);
export const epicInstanceDestroy: Epic<any, any, OgodStateEngine> = (actions$, state$) => actions$.pipe(
    ofType(instanceDestroy.type),
    mergeMap(({ id }) => state$.pipe(
        take(1),
        filter((state) => !!state.instance[id]),
        map((state) => ({
            state: state.instance[id],
            scenes: state.instance[id].scenes.map((sceneId) => state.scene[sceneId]),
            systems: Object.values(state.system)
                .filter((sys) => sys.entities.includes(id))
        }))
    )),
    mergeMap(({ state, scenes, systems }) => {
        const runtime: OgodRuntimeInstance = self.runtimes.instance[state.id] as any;
        if (state.running) {
            state.active = false;
            runtime.stop(state);
        }
        for (let system of systems) {
            self.runtimes.system[system.id].remove(system, state.id, state);
        }
        for (let scene of scenes) {
            self.runtimes.scene[scene.id].remove(scene, state.id, state);
        }
        return runtime.destroy(state);
    })
);
