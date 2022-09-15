import { isEngineActionCanvas, RenderState } from '@ogod/game-core';
import { filter, map, Observable, switchMap } from 'rxjs';
import { AppState, WorkerSources } from '../state';
import { drawCircle, drawRect } from './state';

export function makeRender(canvas: any) {
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
    const drawHandlers = {
        circle: drawCircle(ctx),
        rect: drawRect(ctx)
    };
    return (delta: number, state: AppState) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        Object.values(state.objects).forEach((obj) => drawHandlers[obj.shape](obj));
    };
}

export function makeRender$(sources: WorkerSources): Observable<RenderState> {
    return sources.GameEngine.actions.engine.pipe(
        filter(isEngineActionCanvas),
        switchMap(({ payload }) => sources.GameEngine.render$.pipe(
            map((args) => [...args, makeRender(payload)] as RenderState)
        ))
    );
}
