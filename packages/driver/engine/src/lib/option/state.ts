import { Subject } from 'rxjs';
import { ActionSubject } from '../action/state';
import { EngineSource } from '../driver/state';
import { EngineSubject } from '../engine/state';
import { StateSubject } from '../state/state';

export interface EngineOptions<
    S extends object = any,
    A = any,
    C = OffscreenCanvas> {
    action$: ActionSubject<A>;
    engine$: EngineSubject;
    listeners: Array<(engine: EngineSource) => void>;
    target$: Subject<C>;
    state$: StateSubject<S>;
    workerContext?: DedicatedWorkerGlobalScope;
}
