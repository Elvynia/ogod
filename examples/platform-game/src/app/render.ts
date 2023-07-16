import { EngineFn } from '@ogod/driver-engine';
import { makeDrawCircle, makeDrawRect } from '@ogod/examples-common';
import { Observable, distinctUntilChanged, first, map, switchMap } from 'rxjs';
import { PHASE } from './phase/state';
import { AppState, WorkerSources } from './state';

export function makeRenderer(state: AppState, ctx: OffscreenCanvasRenderingContext2D) {
    const drawHandlers = {
        circle: makeDrawCircle(ctx),
        rect: makeDrawRect(ctx)
    };
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
            Object.values(state.map.platforms).forEach((obj) => drawHandlers.rect(obj));
            Object.values(state.shapes).forEach((obj) => drawHandlers.rect(obj));
        }
    };
}

export function makeRenderer$(sources: WorkerSources): Observable<EngineFn[]> {
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
