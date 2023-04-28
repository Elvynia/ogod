import { Renderer } from '@ogod/game-engine-driver';
import { UpdateState } from 'packages/game-engine-driver/src/lib/update/state';
import { map, Observable } from 'rxjs';
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

export function makeRenderer$(sources: WorkerSources): Observable<Renderer<UpdateState, AppState>[]> {
    return sources.GameEngine.renderTarget$.pipe(
        map((canvas) => [makeRenderer(canvas)])
    );
}
