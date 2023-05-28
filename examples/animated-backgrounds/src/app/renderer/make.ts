import { EngineFn } from '@ogod/game-engine-driver';
import { Observable, first, map, switchMap } from 'rxjs';
import { AppState, WorkerSources } from '../state';
import { drawCircle, drawRect } from './draw';

export function makeRenderer(state: AppState, canvas: OffscreenCanvas) {
    const ctx = canvas.getContext('2d');
    const drawHandlers = {
        circle: drawCircle(ctx),
        rect: drawRect(ctx)
    };
    return () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        Object.values(state.objects).forEach((obj) => drawHandlers[obj.shape](obj));
    };
}

export function makeRenderer$(sources: WorkerSources): Observable<EngineFn[]> {
    return sources.GameEngine.state$.pipe(
        first(),
        switchMap((state) => sources.GameEngine.renderTarget$.pipe(
            map((canvas) => [makeRenderer(state, canvas)])
        ))
    );
}
