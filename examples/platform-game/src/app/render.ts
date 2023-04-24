import { distinctUntilChanged, map, switchMap } from 'rxjs';
import { Camera } from './camera/state';
import { PHASE } from './phase/state';
import { Shape } from "./shape/state";
import { Sleet } from './sleet/state';
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
    return (obj: Shape) => {
        ctx.fillStyle = obj.color;
        ctx.beginPath();
        ctx.arc(obj.x, ctx.canvas.height - obj.y, obj.width / 2, 0, PI2, false);
        ctx.fill();
    }
}

export function makeDrawSleet(ctx: CanvasRenderingContext2D) {
    return (sleet: Sleet) => {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.lineWidth = sleet.width;
        ctx.strokeStyle = sleet.color;
        ctx.arc(sleet.x, sleet.y, sleet.radius, sleet.angleStart, sleet.angleStop);
        ctx.stroke();
    }
}

export const makeDrawHandlers = (ctx) => ({
    circle: makeDrawCircle(ctx),
    rect: makeDrawRect(ctx),
    splash: makeDrawSleet(ctx)
});

export function makeRenderer(ctx: OffscreenCanvasRenderingContext2D) {
    const drawHandlers = makeDrawHandlers(ctx);
    return {
        splash: (delta: number, state: AppState) => {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            Object.values(state.splash).forEach((obj) => drawHandlers.splash(obj));
        },
        start: (delta: number, state: AppState) => {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            Object.values(state.background.gradients).forEach((g) => {
                ctx.fillStyle = g.color;
                ctx.fillRect(g.x, g.y, g.width, g.height);
            });
        },
        play: (delta: number, state: AppState) => {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            Object.values(state.background.gradients).forEach((g) => {
                ctx.fillStyle = g.color;
                ctx.fillRect(g.x, g.y, g.width, g.height);
            });
            Object.values(state.gmap.platforms).forEach((obj) => drawHandlers[obj.type](obj, state.camera));
            Object.values(state.shapes).forEach((obj) => drawHandlers[obj.type](obj, state.camera));
        }
    };
}

export function makeRenderer$(sources: WorkerSources) {
    return sources.GameEngine.renderTarget$.pipe(
        switchMap((canvas) => {
            const ctx = canvas.getContext('2d');
            const renderers = makeRenderer(ctx);
            return sources.GameEngine.state$.pipe(
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
        }),

    )
}
