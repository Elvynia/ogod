import { Subject } from 'rxjs';
import { ActionHandler } from '../../action/state';
import { FeatureState } from '../../feature/state';

export interface GameEngineOptions<S extends FeatureState, AS = {},
    AH extends ActionHandler<Partial<S> & AS> = ActionHandler<Partial<S> & AS>> {
    actionHandlers: AH;
    dispose?: () => void;
    state$: Subject<S>;
    workerContext?: DedicatedWorkerGlobalScope;
}
