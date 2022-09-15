import { ActionState, EngineAction, GameEngineOptions } from '@ogod/game-core';
import { ReplaySubject, Subject } from 'rxjs';

export function makeGameEngineOptions<S = any, A extends string = any, R = any, AS extends ActionState<A> = ActionState<A>>(
    workerContext?: DedicatedWorkerGlobalScope, keys: Array<A> = [],
    custom?: Partial<Record<A, Subject<any>>>): GameEngineOptions<S, A, R, AS> {
    let actionHandlers = keys.map((k) => ({ [k]: new Subject<any>() }))
        .reduce((a, b) => Object.assign(a, b), { engine: new Subject<EngineAction>() }) as AS;
    if (custom) {
        actionHandlers = {
            ...actionHandlers,
            ...custom
        }
    }
    return {
        actionHandlers,
        state$: new ReplaySubject<S>(1),
        workerContext,
        reflectThrottle: 1 / 60
    }
}
