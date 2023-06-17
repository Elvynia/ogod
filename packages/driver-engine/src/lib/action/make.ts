import { ActionEngine, ActionHandlerDefault, isActionEngineClose, isActionEngineResize, isActionEngineTarget } from '@ogod/core';
import { Subject, filter, withLatestFrom } from 'rxjs';
import { EngineSource } from '../driver/state';

export function makeActionEngineHandler(): ActionHandlerDefault {
    return {
        engine: new Subject<ActionEngine>()
    }
}

export function makeActionEngineListener() {
    return (engine: EngineSource<any, ActionHandlerDefault>) => {
        engine.action$.getHandler('engine').pipe(
            filter(isActionEngineTarget)
        ).subscribe(({ payload }) => engine.target$.next(payload));
        engine.action$.getHandler('engine').pipe(
            filter(isActionEngineResize),
            withLatestFrom(engine.target$)
        ).subscribe(([{ payload }, canvas]) => {
            canvas.width = payload.width;
            canvas.height = payload.height;
            engine.target$.next(canvas);
        });
        if (engine.workerContext) {
            engine.action$.getHandler('engine').pipe(
                filter(isActionEngineClose)
            ).subscribe(() => engine.workerContext!.close());
        }
    }
}
