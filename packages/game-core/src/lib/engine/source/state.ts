import { Observable, Subject } from 'rxjs';
import { ActionHandler } from '../../action/state';
import { GameEngineOptions } from '../options/state';

export interface GameEngineSource {
    action$: ActionHandler<any>;
    canvas?: any;
    dispose: Function;
    frame$: Observable<{ timestamp: number, elapsed: number }>;
    options: GameEngineOptions;
    render$: Observable<[number, any]>;
    state$: Subject<any>;
    update$: Observable<number>;
}
