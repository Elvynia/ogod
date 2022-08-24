import { Observable, Subject } from 'rxjs';
import { ActionHandler } from '../action/state';
import { FeatureState } from '../feature/state';
import { GameEngineOptions } from '../options/state';

export interface OffscreenCanvas {
    width: number;
    height: number;
}

export interface GameEngineSource<S extends FeatureState, A = Partial<S>> {
    action$: ActionHandler<A>;
    canvas?: OffscreenCanvas;
    dispose: Function;
    frame$: Observable<{ timestamp: number, elapsed: number }>;
    options: GameEngineOptions<S, A>;
    render$: Observable<[number, S]>;
    state$: Subject<S>;
    update$: Observable<number>;
}
