import { Observable, Subject } from 'rxjs';
import { ActionHandler } from '../../action/state';
import { FeatureState } from '../../feature/state';
import { GameEngineOptions } from '../options/state';

export interface GameEngineSource<S extends FeatureState, AS = {},
    AH extends ActionHandler<Partial<S> & AS> = ActionHandler<Partial<S> & AS>> {
    action$: AH;
    // canvas?: OffscreenCanvas;
    dispose: Function;
    frame$: Observable<{ timestamp: number, elapsed: number }>;
    options: GameEngineOptions<S, AS, AH>;
    render$: Observable<[number, S]>;
    state$: Subject<S>;
    update$: Observable<number>;
}
