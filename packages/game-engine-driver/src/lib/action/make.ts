import { EngineAction, isEngineActionCanvas, isEngineActionClose } from '@ogod/game-core';
import { Subject, filter } from 'rxjs';
import { GameEngineSource } from '../driver/state';
import { ActionHandlers, ActionSubjectParams } from './state';

export function makeActionSubjectParams<A extends string = string>(
    keys: ReadonlyArray<A> = [], handlers: Partial<ActionHandlers<A>> = {}): ActionSubjectParams<A> {
    return {
        handlers: {
            engine: new Subject<EngineAction>(),
            ...handlers
        } as ActionHandlers<A>,
        keys
    }
}

export function makeActionEngineListener(engine: GameEngineSource<any, 'engine'>): void {
    engine.action$.handlers.engine.pipe(
        filter(isEngineActionCanvas)
    ).subscribe(({ payload }) => engine.renderTarget$.next(payload));
    if (engine.workerContext) {
        engine.action$.handlers.engine.pipe(
            filter(isEngineActionClose)
        ).subscribe(() => engine.workerContext!.close());
    }
}
