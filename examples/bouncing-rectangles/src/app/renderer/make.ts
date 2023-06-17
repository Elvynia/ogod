import { filter, first, map, switchMap } from "rxjs";
import { Rect } from "../rect/state";
import { AppState, WorkerSources } from "../state";

function makeDrawRect(ctx: CanvasRenderingContext2D) {
    return (rect: Rect) => {
        ctx.save();
        ctx.translate(rect.x, ctx.canvas.height - rect.y);
        ctx.rotate(-rect.body.GetAngle());
        ctx.fillStyle = rect.color;
        ctx.fillRect(-rect.width / 2, -rect.height / 2, rect.width, rect.height);
        ctx.restore();
    }
}

export const makeRenderer = (state: AppState, canvas: any) => {
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
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
