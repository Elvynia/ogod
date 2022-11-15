import { isEngineActionCanvas, RenderState } from "@ogod/game-core";
import { filter, first, map, switchMap } from "rxjs";
import { AppState, WorkerSources } from "../state";

export function makeRender(ctx: CanvasRenderingContext2D) {
    return (_, state: AppState) => ctx.putImageData(state.data, 0, 0);
}

export function makeRender$(sources: WorkerSources) {
    return sources.GameEngine.actions.engine.pipe(
        filter(isEngineActionCanvas),
        switchMap(({ payload }) => {
            const ctx: CanvasRenderingContext2D = payload.getContext('2d');
            const render = makeRender(ctx);
            return sources.GameEngine.state$.pipe(
                filter((s) => !!s.data),
                first(),
                switchMap(() => sources.GameEngine.render$.pipe(
                    map((args) => [...args, render] as RenderState)
                ))
            )
        })
    );
}
