import { Observable, Subject } from 'rxjs';
import { ActionState } from '../../action/state';
import { FeatureState } from '../../feature/state';
import { GameEngineOptions } from '../options/state';

export interface GameEngineSource<S = any, A extends string = any, AS extends ActionState<A> = ActionState<A>, FS = FeatureState<keyof S & string>> {
    actions: AS;
    canvas?: any;
    dispose: Function;
    frame$: Observable<{ timestamp: number, elapsed: number }>;
    options: GameEngineOptions<S, A, AS>;
    render$: Observable<[number, FS]>;
    state$: Subject<FS>;
    update$: Observable<number>;
}
