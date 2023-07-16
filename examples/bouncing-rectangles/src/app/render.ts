import { makeDrawRect } from "@ogod/examples-common";
import { filter, first, map, switchMap } from "rxjs";
import { AppState, WorkerSources } from "./state";

export const makeRenderer = (state: AppState, canvas: any) => {
    const ctx = canvas.getContext('2d');
    const drawRect = makeDrawRect(ctx);
    return () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        Object.values(state.objects).forEach(drawRect);
        state.grounds.forEach(drawRect);
        drawRect(state.player);
    };
}

export function makeRenderer$(sources: WorkerSources) {
    return sources.Engine.target$.pipe(
        switchMap((canvas) => sources.Engine.state$.pipe(
            filter((state) => state.player && !!state.objects && !!state.grounds),
            first(),
            map((state) => [makeRenderer(state, canvas)])
        )),
    );
}
