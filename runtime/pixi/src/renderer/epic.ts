import { ogodEpicActorInit, ogodEpicActorDestroy, ogodEpicActorChanges } from "@ogod/runtime-core";
import { rendererChanges } from "./action";
import { ofType, Epic } from "redux-observable";
import { mergeMap, filter, take, map, tap } from "rxjs/operators";
import { PixiStateEngine } from "../engine/state";
import { PixiRuntimeEngine } from "../engine/runtime";
import { PixiRuntimeRenderer } from "./runtime";

declare var self: PixiRuntimeEngine;

export const epicRendererInit = ogodEpicActorInit('renderer');
export const epicRendererChanges: Epic<any, any, PixiStateEngine> = (action$, state$) => action$.pipe(
    ofType(rendererChanges.type),
    mergeMap(({ id, changes }) => state$.pipe(
        filter((state) => state.renderer && !!state.renderer.renderer$),
        map((state) => ({
            id,
            changes,
            state: state.renderer
        })),
        take(1)
    )),
    mergeMap(({ id, changes, state }) => {
        const runtime = self.getRuntime<PixiRuntimeRenderer>('renderer', id);
        return runtime.changes(changes, state);
    })
);
export const epicRendererDestroy = ogodEpicActorDestroy('renderer');
