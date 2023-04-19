import { isEngineActionCanvas } from "@ogod/game-core";
import { filter, first, map, switchMap } from "rxjs";
import { AppState, WorkerSources } from "../state";

export function makeRenderer(ctx: OffscreenCanvasRenderingContext2D) {
    return (_, state: AppState) => ctx.putImageData(state.data, 0, 0);
}

export function makeRenderer$(sources: WorkerSources) {
    return sources.GameEngine.actionHandlers.engine.pipe(
        filter(isEngineActionCanvas),
        switchMap(({ payload }) => {
            return sources.GameEngine.state$.pipe(
                filter((s) => !!s.data),
                first(),
                map(() => [makeRenderer(payload.getContext('2d'))])
            )
        })
    );
}
