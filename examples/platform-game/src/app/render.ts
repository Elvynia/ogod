import { UpdateState } from '@ogod/core';
import { EngineFn } from '@ogod/driver-engine';
import { Observable, distinctUntilChanged, first, map, switchMap } from 'rxjs';
import { Camera } from './camera/state';
import { PHASE } from './phase/state';
import { Shape } from "./shape/state";
import { Circle } from './splash/state';
import { AppState, WorkerSources } from './state';

const PI2 = 2 * Math.PI;

export function makeDrawRect(ctx: CanvasRenderingContext2D) {
    return (shape: Shape, camera: Camera) => {
        ctx.save();
        ctx.translate(shape.x - camera.x, ctx.canvas.height - shape.y + camera.y);
        ctx.rotate(-shape.body.GetAngle());
        ctx.fillStyle = shape.color;
        ctx.fillRect(-shape.width / 2, -shape.height / 2, shape.width, shape.height);
        ctx.restore();
    };
}

export function makeDrawCircle(ctx: CanvasRenderingContext2D) {
    return (obj: Circle) => {
        ctx.fillStyle = obj.color;
        ctx.beginPath();
        ctx.arc(obj.x, ctx.canvas.height - obj.y, obj.radius / 2, 0, PI2, false);
        ctx.fill();
    }
}

export const makeDrawHandlers = (ctx) => ({
    circle: makeDrawCircle(ctx),
    rect: makeDrawRect(ctx)
});

export function makeRenderer(state: AppState, ctx: OffscreenCanvasRenderingContext2D) {
    const drawHandlers = makeDrawHandlers(ctx);
    return {
        splash: () => {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            Object.values(state.splash).forEach((obj) => drawHandlers.circle(obj));
        },
        start: () => {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            const grad = state.background.gradient;
            ctx.fillStyle = grad.color;
            ctx.fillRect(grad.x, grad.y, grad.width, grad.height);
        },
        play: () => {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            const grad = state.background.gradient;
            ctx.fillStyle = grad.color;
            ctx.fillRect(grad.x, grad.y, grad.width, grad.height);
            Object.values(state.map.platforms).forEach((obj) => drawHandlers.rect(obj, state.camera));
            Object.values(state.shapes).forEach((obj) => drawHandlers.rect(obj, state.camera));
        }
    };
}

export function makeRenderer$(sources: WorkerSources): Observable<EngineFn<UpdateState>[]> {
    return sources.Engine.state$.pipe(
        first(),
        switchMap((state) => sources.Engine.target$.pipe(
            switchMap((canvas) => {
                const ctx = canvas.getContext('2d');
                const renderers = makeRenderer(state, ctx);
                return sources.Engine.state$.pipe(
                    map((s) => s.phase),
                    distinctUntilChanged(),
                    map((phase) => {
                        switch (phase) {
                            case PHASE.SPLASH:
                                return [renderers.splash];
                            case PHASE.START:
                                return [renderers.start];
                            case PHASE.PLAY:
                                return [renderers.play];
                            case PHASE.END:
                                ctx.clearRect(0, 0, canvas.width, canvas.height);
                            default:
                                return [];
                        }
                    })
                );
            })
        ))
    )
}
