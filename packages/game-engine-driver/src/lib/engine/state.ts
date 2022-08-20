import { Observable, ReplaySubject, Subject } from 'rxjs';
import { FeatureState } from '../feature/state';
import { ActionHandler, ActionState } from './../action/state';

export interface GameEngineSource<S extends FeatureState> {
    action$: ActionState<S>;
    dispose: Function;
    frame$: Observable<{ timestamp: number, elapsed: number }>;
    render$: Observable<[number, S]>;
    state$: Subject<S>;
    update$: Observable<number>;
}

export interface GameEngineOptions<S extends FeatureState> {
    additionalActionHandler?: ActionHandler<any>;
    dispose?: () => void;
    state$: Subject<S>;
    workerContext?: DedicatedWorkerGlobalScope;
    reflectHandler: (state: S) => any;
}

export function makeGameEngineOptionsDefault<S extends FeatureState>(): GameEngineOptions<S> {
    return {
        state$: new ReplaySubject<S>(1),
        reflectHandler: (state) => state
    }
}
