import { Subject } from 'rxjs';
import { ActionSubject } from '../action/state';
import { GameEngineSource } from '../driver/state';
import { RendererSubject } from '../render/state';
import { UpdateState } from '../update/state';

export interface GameEngineOptions<
    U = UpdateState,
    S = any,
    A extends string = string,
    C = OffscreenCanvas> {
    action$: ActionSubject<A>;
    game$: RendererSubject<U, S>;
    listeners: Array<(engine: GameEngineSource) => void>;
    renderTarget$: Subject<C>;
    state$: Subject<S>;
    workerContext?: DedicatedWorkerGlobalScope;
}
