import { DisposeFunction } from '@ogod/game-core';
import { Subject } from 'rxjs';

export interface GameEngineOptions<
    S extends Record<string, any> = any,
    A extends string = any> {
    actionKeys: ReadonlyArray<A>;
    dispose?: DisposeFunction;
    state$?: Subject<S>;
    workerContext?: DedicatedWorkerGlobalScope;
    // FIXME: defaults: game$, update$, target$, renderers ?
}
