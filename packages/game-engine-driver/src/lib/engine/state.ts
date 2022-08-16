import { Observable, ReplaySubject, Subject } from 'rxjs';
import { FeatureState } from '../feature/state';
import { ActionState, WorkerMessage } from './../action/state';

export interface GameEngineSource<S extends FeatureState> {
    action$: ActionState<S>;
    dispose: Function;
    frame$: Observable<number>;
    render$: Observable<[number, S]>;
    state$: Subject<S>;
}

export interface GameEngineWorker<S extends FeatureState> {
    input$: ReplaySubject<S>;
    output$: Subject<WorkerMessage>;
}
