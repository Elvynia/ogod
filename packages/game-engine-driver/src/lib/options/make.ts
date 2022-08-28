import { ActionState, EngineAction, EngineActionState, FeatureState, GameEngineOptions } from '@ogod/game-core';
import { ReplaySubject, Subject } from 'rxjs';

export function makeGameEngineOptions<S extends FeatureState, AS = {}, AH extends ActionState<Partial<S> & AS> & EngineActionState
    = ActionState<Partial<S> & AS> & EngineActionState>(workerContext?: DedicatedWorkerGlobalScope,
        keys: Array<keyof S | keyof AS> = [], custom?: ActionState<AS>): GameEngineOptions<S, AS, AH> {
    let actionHandlers = keys.map((k) => ({ [k]: new Subject() }))
        .reduce((a, b) => Object.assign(a, b), { engine: new Subject<EngineAction>() }) as AH;
    if (custom) {
        actionHandlers = {
            ...actionHandlers,
            ...custom
        }
    }
    return {
        actionHandlers,
        state$: new ReplaySubject<S>(1),
        workerContext
    }
}
