import { Subject } from 'rxjs';
import { ActionHandler } from '../../action/state';

export interface GameEngineOptions {
    actionHandlers: ActionHandler<any>;
    dispose?: () => void;
    state$: Subject<any>;
    workerContext?: DedicatedWorkerGlobalScope;
}
