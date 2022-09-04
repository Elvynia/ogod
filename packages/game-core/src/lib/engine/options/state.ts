import { Subject } from 'rxjs';
import { ActionState } from '../../action/state';

export interface GameEngineOptions<S = any, A extends string = any, AS extends ActionState<A> = ActionState<A>> {
    actionHandlers: AS;
    dispose?: () => void;
    state$: Subject<S>;
    workerContext?: DedicatedWorkerGlobalScope;
}
