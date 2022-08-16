import { Observable, Subject } from 'rxjs';
import { FeatureState } from '../feature/state';
import { ActionState } from './../action/state';

export interface GameEngineSource<S extends FeatureState> {
    action$: ActionState<S>;
    dispose: Function;
    frame$: Observable<number>;
    render$: Observable<[number, S]>;
    state$: Subject<S>;
}
