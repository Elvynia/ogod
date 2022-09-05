import { Subject } from 'rxjs';
import { ActionState } from '../../action/state';
import { FeatureMapperFunction } from '../../feature/state';
import { ReflectState } from '../../reflector/state';
import { RenderState } from '../../renderer/state';

export interface GameEngineOptions<S = any, A extends string = any, AS extends ActionState<A> = ActionState<A>> {
    actionHandlers: AS;
    dispose?: () => void;
    state$: Subject<S>;
    workerContext?: DedicatedWorkerGlobalScope;
    reflectMapper: FeatureMapperFunction<ReflectState>;
    renderMapper: FeatureMapperFunction<RenderState>
}
