import { ActionState } from './../action/state';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { FeatureState } from '../feature/state';

export interface GameEngineSource<S extends FeatureState> {
    actions: ActionState<S>;
    dispose: Function;
    frame$: Observable<number>;
    game$: Observable<S>;
    state$: BehaviorSubject<S>;
}
