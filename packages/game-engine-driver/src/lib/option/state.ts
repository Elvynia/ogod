import { DisposeFunction } from '@ogod/game-core';
import { Subject } from 'rxjs';

export interface GameEngineOptions<S extends Record<K, any> = any,
    A extends string = any, K extends keyof S = keyof S> {
    actionKeys: A[];
    dispose?: DisposeFunction;
    state$?: Subject<S>;
    workerContext?: DedicatedWorkerGlobalScope;
    // FIXME: defaults: game$, update$, target$, renderers ?
}
