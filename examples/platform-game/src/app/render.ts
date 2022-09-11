import { isEngineActionCanvas, RenderState } from '@ogod/game-core';
import { makeRuntime } from '@ogod/game-engine-driver';
import { concat, distinctUntilChanged, EMPTY, filter, first, map, of, switchMap } from 'rxjs';
import { Camera } from './camera/state';
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

export function makeDrawSvg(ctx: CanvasRenderingContext2D) {
    ctx.lineCap = 'round';
    return (sleet: Sleet) => {
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
    svg: makeDrawSvg(ctx)
});

export function makeRender(ctx: CanvasRenderingContext2D) {
    const drawHandlers = makeDrawHandlers(ctx);
    return {
        splash: (delta: number, state: AppState) => {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            Object.values(state.splash).forEach((obj) => drawHandlers['svg'](obj));
        },
        // start: (delta: number, state: AppState) => {
        //     ctx.clearRect(0, 0, canvas.width, canvas.height);
        //     Object.values(state.background.gradients).forEach((g) => {
        //         ctx.fillStyle = g.color;
        //         ctx.fillRect(g.x, g.y, g.width, g.height);
        //     });
        // },
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

export function makeRender$(sources: WorkerSources) {
    return sources.GameEngine.actions.engine.pipe(
        filter(isEngineActionCanvas),
        switchMap(({ payload }) => {
            const ctx: CanvasRenderingContext2D = payload.getContext('2d');
            const renderers = makeRender(ctx);
            return concat(
                sources.GameEngine.state$.pipe(
                    filter((s) => !!s.splash),
                    first(),
                    map(() => makeRuntime<RenderState>(renderers.splash, sources.GameEngine.state$.pipe(
                        filter((state) => !state.splash),
                        first()
                    )))
                ),
                // sources.GameEngine.state$.pipe(
                //     filter((s) => s.loaded && !s.splash),
                //     first(),
                //     map(() => makeRuntime<RenderState>(renderers.start, sources.GameEngine.state$.pipe(
                //         filter((s) => s.start),
                //         first()
                //     )))
                // ),
                sources.GameEngine.state$.pipe(
                    map((s) => s.loaded),
                    distinctUntilChanged(),
                    switchMap((loaded) => {
                        if (!loaded) {
                            ctx.clearRect(0, 0, payload.width, payload.height);
                            return EMPTY;
                        }
                        return of(makeRuntime<RenderState>(
                            renderers.play,
                            sources.GameEngine.state$.pipe(
                                filter((s) => !s.loaded),
                                first()
                            )
                        ));
                    })
                )
            );
        }),

    )
}
