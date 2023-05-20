import { filter, first, map, switchMap } from "rxjs";
import { AppState, WorkerSources } from "../state";

export function makeRenderer(ctx: OffscreenCanvasRenderingContext2D) {
    return (_, state: AppState) => ctx.putImageData(state.data, 0, 0);
}

export function makeRenderer$(sources: WorkerSources) {
    return sources.GameEngine.renderTarget$.pipe(
        switchMap((canvas) => {
            return sources.GameEngine.game$.pipe(
                filter(([_, s]) => !!s.data),
                first(),
                map(() => [makeRenderer(canvas.getContext('2d'))])
            )
        })
    );
}
