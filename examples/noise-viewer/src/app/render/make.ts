import { filter, first, map, switchMap } from "rxjs";
import { AppState, WorkerSources } from "../state";

export function makeRenderer(state: AppState, ctx: OffscreenCanvasRenderingContext2D) {
    return () => ctx.putImageData(state.data, 0, 0);
}

export function makeRenderer$(sources: WorkerSources) {
    return sources.Engine.target$.pipe(
        switchMap((canvas) => {
            return sources.Engine.state$.pipe(
                filter((s) => !!s.data),
                first(),
                map((state) => [makeRenderer(state, canvas.getContext('2d'))])
            )
        })
    );
}
