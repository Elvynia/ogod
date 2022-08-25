import { Observable, Subject } from 'rxjs';
import { ActionHandler } from '../action/state';
import { OffscreenCanvas } from '../engine/state';
import { FeatureState } from '../feature/state';

export interface GameEngineOptions<S extends FeatureState, AS = {},
    AH extends ActionHandler<Partial<S> & AS> = ActionHandler<Partial<S> & AS>> {
    actionHandlers: AH;
    dispose?: () => void;
    makeRender?: (canvas: OffscreenCanvas) => (delta: number, state: S) => void;
    state$: Subject<S>;
    reflectHandler?: Observable<(state: Partial<S>) => any>;
    workerContext?: DedicatedWorkerGlobalScope;
}
