import { Observable, ReplaySubject, Subject } from 'rxjs';
import { FeatureState } from '../feature/state';
import { ActionHandler, ActionState } from './../action/state';

export interface EngineAction {
    type: string;
}

export interface GameEngineSource<S extends FeatureState, A = Partial<S>> {
    action$: ActionHandler<A>;
    dispose: Function;
    frame$: Observable<{ timestamp: number, elapsed: number }>;
    render$: Observable<[number, S]>;
    state$: Subject<S>;
    update$: Observable<number>;
}

export interface GameEngineOptions<S extends FeatureState, A = Partial<S>> {
    actionHandlers: ActionHandler<A>;
    dispose?: () => void;
    state$: Subject<S>;
    reflectHandler?: (state: S) => any;
    workerContext?: DedicatedWorkerGlobalScope;
}

export function makeGameEngineOptions<S extends FeatureState, A extends ActionState<Partial<S>>>(_actionHandlers: Array<keyof A | Partial<A>> = []): GameEngineOptions<S, A> {
    const actionHandlers = _actionHandlers
        .map((keyOrHandler) => typeof keyOrHandler === 'string' ? { [keyOrHandler]: new Subject<any>() } : keyOrHandler)
        .reduce((a, b) => Object.assign(a, b), { close: new Subject<void>() }) as any as ActionHandler<A>;
    return {
        actionHandlers,
        state$: new ReplaySubject<S>(1),
    }
}
