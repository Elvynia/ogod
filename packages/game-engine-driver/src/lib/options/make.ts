import { ActionState, EngineAction, GameEngineOptions, ActionHandler } from '@ogod/game-core';
import { ReplaySubject, Subject } from 'rxjs';

export function makeGameEngineOptions(workerContext?: DedicatedWorkerGlobalScope, keys: Array<string> = [],
    custom?: ActionState<any>): GameEngineOptions {
    let actionHandlers = keys.map((k) => ({ [k]: new Subject<any>() }))
        .reduce((a, b) => Object.assign(a, b), { engine: new Subject<EngineAction>() }) as ActionHandler<any>;
    if (custom) {
        actionHandlers = {
            ...actionHandlers,
            ...custom
        }
    }
    return {
        actionHandlers,
        state$: new ReplaySubject<any>(1),
        workerContext
    }
}
