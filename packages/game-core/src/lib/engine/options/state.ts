import { Subject } from 'rxjs';
import { ActionState } from '../../action/state';
import { FeatureMapperFunction } from '../../feature/state';
import { ReflectState } from '../../reflect/state';
import { RenderState } from '../../render/state';

export interface GameEngineOptions<S = any, A extends string = any, R = any, AS extends ActionState<A> = ActionState<A>> {
    actionHandlers: AS;
    dispose?: () => void;
    state$: Subject<S>;
    workerContext?: DedicatedWorkerGlobalScope;
    reflectMapper: FeatureMapperFunction<ReflectState<S, R>>;
    renderMapper: FeatureMapperFunction<RenderState<S>>;
    reflectThrottle: number;
}
