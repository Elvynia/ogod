import { createNoise2D } from 'simplex-noise';
import { isEngineActionCanvas, RenderState } from "@ogod/game-core";
import { filter, map, switchMap } from "rxjs";
import { AppState, WorkerSources } from "../state";

export function makeRender(ctx: CanvasRenderingContext2D) {
    return (_, state: AppState) => {
        state.noises.forEach((n) => ctx.putImageData(n.data, n.x, n.y));
    }
}

export function makeRender$(sources: WorkerSources) {
    return sources.GameEngine.actions.engine.pipe(
        filter(isEngineActionCanvas),
        switchMap(({ payload }) => {
            const ctx: CanvasRenderingContext2D = payload.getContext('2d');
            const render = makeRender(ctx);
            return sources.GameEngine.render$.pipe(
                map((args) => [...args, render] as RenderState)
            )
        })
    );
}
