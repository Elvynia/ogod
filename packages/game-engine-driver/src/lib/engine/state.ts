import { Observable, ReplaySubject, Subject } from 'rxjs';
import { FeatureState } from '../feature/state';
import { ActionHandler, ActionState } from './../action/state';

export interface GameEngineSource<S extends FeatureState> {
    action$: ActionState<S>;
    dispose: Function;
    frame$: Observable<number>;
    render$: Observable<[number, S]>;
    state$: Subject<S>;
}

export interface GameEngineOptions<S extends FeatureState> {
    state$: Subject<S>;
    dispose?: () => void;
    additionalActionHandler?: ActionHandler<any>;
}

export function makeGameEngineOptionsDefault<S extends FeatureState>(): GameEngineOptions<S> {
    return {
        state$: new ReplaySubject<S>(1)
    }
}
