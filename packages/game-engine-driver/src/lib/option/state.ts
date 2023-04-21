import { Subject } from 'rxjs';
import { RendererSubject } from '../render/state';

export interface GameEngineOptions<
    S = any,
    A extends string = any,
    C = OffscreenCanvas> {
    actionKeys: ReadonlyArray<A>;
    actionHandlerDefaults?: Partial<Record<A, Subject<any>>>;
    game$: RendererSubject<S>;
    renderTarget$: Subject<C>;
    state$: Subject<S>;
    workerContext?: DedicatedWorkerGlobalScope;
}
