import { ActionHandlerDefault, EngineAction, isEngineActionCanvas, isEngineActionClose } from '@ogod/game-core';
import { Subject, filter } from 'rxjs';
import { GameEngineSource } from '../driver/state';

export function makeActionEngineHandler(): ActionHandlerDefault {
    return {
        engine: new Subject<EngineAction>()
    }
}

export function makeActionEngineListener(engine: GameEngineSource<any, ActionHandlerDefault>): void {
    engine.action$.getHandler('engine').pipe(
        filter(isEngineActionCanvas)
    ).subscribe(({ payload }) => engine.renderTarget$.next(payload));
    if (engine.workerContext) {
        engine.action$.getHandler('engine').pipe(
            filter(isEngineActionClose)
        ).subscribe(() => engine.workerContext!.close());
    }
}
