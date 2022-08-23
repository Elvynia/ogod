import { ReplaySubject, Subject } from 'rxjs';
import { ActionHandler, ActionState } from '../action/state';
import { FeatureState } from '../feature/state';
import { EngineAction } from './../action/state';
import { GameEngineOptions } from './state';

export function makeGameEngineOptions<S extends FeatureState, A extends ActionState<Partial<S>>>(_actionHandlers: Array<keyof A | Partial<A>> = []): GameEngineOptions<S, A> {
    const actionHandlers = _actionHandlers
        .map((keyOrHandler) => typeof keyOrHandler === 'string' ? { [keyOrHandler]: new Subject<any>() } : keyOrHandler)
        .reduce((a, b) => Object.assign(a, b), { engine: new Subject<EngineAction>() }) as ActionHandler<A>;
    return {
        actionHandlers,
        state$: new ReplaySubject<S>(1),
    }
}
