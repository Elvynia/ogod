import { Subject } from 'rxjs';
import { BehaviorSubject, Observable } from 'rxjs';
import { GameState } from '../game/state';

export interface GameEngineSource<S extends GameState> {
    dispose: any;
    frame$: Observable<number>;
    state$: BehaviorSubject<S>;
    action$: Subject<any>;
    game$: Observable<S>;
}
