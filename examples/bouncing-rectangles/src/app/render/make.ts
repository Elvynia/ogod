import { isEngineActionCanvas, RenderState } from "@ogod/game-core";
import { makeRuntime } from "@ogod/game-engine-driver";
import { delayWhen, filter, first, map, Observable } from "rxjs";
import { Rect } from "../rect";
import { AppState, WorkerSources } from "../state";

function makeDrawRect(canvas, ctx: CanvasRenderingContext2D) {
    return (rect: Rect) => {
        ctx.save();
        ctx.translate(rect.x, canvas.height - rect.y);
        ctx.rotate(-rect.body.GetAngle());
        ctx.fillStyle = rect.color;
        ctx.fillRect(-rect.width / 2, -rect.height / 2, rect.width, rect.height);
        ctx.restore();
    }
}

export const makeRender = (canvas: any) => {
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
    const drawRect = makeDrawRect(canvas, ctx);
    return (_, state: AppState) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        Object.values(state.objects).forEach(drawRect);
        state.grounds.forEach(drawRect);
        drawRect(state.player);
    };
}

export function makeRender$(sources: WorkerSources): Observable<RenderState> {
    return sources.GameEngine.actions.engine.pipe(
        filter(isEngineActionCanvas),
        delayWhen(() => sources.GameEngine.state$.pipe(
            filter((state) => state.screen && state.player && !!state.objects),
            first()
        )),
        map(({ payload }) => makeRuntime(makeRender(payload)))
    );
}
