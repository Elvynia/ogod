import { Subject } from 'rxjs';
import { ActionSubject } from '../action/state';
import { GameEngineSource } from '../driver/state';
import { RendererSubject } from '../render/state';
import { StateSubject } from '../state/state';
import { UpdateState } from '../update/state';

export interface GameEngineOptions<
    U = UpdateState,
    S extends object = any,
    A = any,
    C = OffscreenCanvas> {
    action$: ActionSubject<A>;
    game$: RendererSubject<U, S>;
    listeners: Array<(engine: GameEngineSource) => void>;
    renderTarget$: Subject<C>;
    state$: StateSubject<S>;
    workerContext?: DedicatedWorkerGlobalScope;
}
