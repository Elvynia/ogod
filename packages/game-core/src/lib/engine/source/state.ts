import { Observable, Subject } from 'rxjs';
import { ActionState } from '../../action/state';
import { GameEngineOptions } from '../options/state';

export interface GameEngineSource<S = any, A extends string = any, R = any, AS extends ActionState<A> = ActionState<A>> {
    actions: AS;
    canvas?: any;
    dispose: Function;
    frame$: Observable<{ timestamp: number, elapsed: number }>;
    options: GameEngineOptions<S, A, R, AS>;
    render$: Observable<[number, S]>;
    state$: Subject<S>;
    update$: Subject<number>;
}
