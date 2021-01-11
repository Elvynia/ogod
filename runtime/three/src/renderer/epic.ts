import { ogodEpicActorDestroy, ogodEpicActorInit } from "@ogod/runtime-core";
import { Epic, ofType } from "redux-observable";
import { filter, map, mergeMap, take } from "rxjs/operators";
import { ThreeRuntimeEngine } from "../engine/runtime";
import { ThreeStateEngine } from "../engine/state";
import { rendererChanges } from "./action";
import { ThreeRuntimeRenderer } from "./default/runtime";

declare var self: ThreeRuntimeEngine;

export const epicRendererInit = ogodEpicActorInit('renderer');
export const epicRendererChanges: Epic<any, any, ThreeStateEngine> = (action$, state$) => action$.pipe(
    ofType(rendererChanges.type),
    mergeMap(({ id, changes }) => state$.pipe(
        filter((state) => state.renderer && !!state.renderer.renderer$), // FIXME: should use loading/loaded and ogodEpicActionChanges
        map((state) => ({
            id,
            changes,
            state: state.renderer
        })),
        take(1)
    )),
    mergeMap(({ id, changes, state }) => {
        const runtime = self.getRuntime<ThreeRuntimeRenderer>('renderer', id);
        return runtime.changes(changes, state);
    })
);
export const epicRendererDestroy = ogodEpicActorDestroy('renderer');
