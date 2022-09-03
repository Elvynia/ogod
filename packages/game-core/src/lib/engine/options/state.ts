import { Subject } from 'rxjs';
import { ActionState } from '../../action/state';
import { FeatureState } from '../../feature/state';

export interface GameEngineOptions<S = any, A extends string = any, AS extends ActionState<A> = ActionState<A>, FS = FeatureState<keyof S & string>> {
    actionHandlers: AS;
    dispose?: () => void;
    state$: Subject<FS>;
    workerContext?: DedicatedWorkerGlobalScope;
}
