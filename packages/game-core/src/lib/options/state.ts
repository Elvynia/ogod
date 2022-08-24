import { Observable, Subject } from 'rxjs';
import { ActionHandler } from '../action/state';
import { OffscreenCanvas } from '../engine/state';
import { FeatureState } from '../feature/state';

export interface GameEngineOptions<S extends FeatureState, A = Partial<S>> {
    actionHandlers: ActionHandler<A>;
    dispose?: () => void;
    makeRender?: (canvas: OffscreenCanvas) => (delta: number, state: S) => void;
    state$: Subject<S>;
    reflectHandler?: Observable<(state: S) => any>;
    workerContext?: DedicatedWorkerGlobalScope;
}
