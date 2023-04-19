import { isEngineActionCanvas } from '@ogod/game-core';
import { Renderer } from '@ogod/game-engine-driver';
import { filter, map, Observable } from 'rxjs';
import { AppState, WorkerSources } from '../state';
import { drawCircle, drawRect } from './draw';

export function makeRenderer(canvas: OffscreenCanvas) {
    const ctx = canvas.getContext('2d');
    const drawHandlers = {
        circle: drawCircle(ctx),
        rect: drawRect(ctx)
    };
    return (_, state: AppState) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        Object.values(state.objects).forEach((obj) => drawHandlers[obj.shape](obj));
    };
}

export function makeRenderer$(sources: WorkerSources): Observable<Renderer<AppState>[]> {
    return sources.GameEngine.actionHandlers.engine.pipe(
        filter(isEngineActionCanvas),
        map(({ payload }) => [makeRenderer(payload)])
    );
}
