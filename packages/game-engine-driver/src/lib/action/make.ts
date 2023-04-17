import { isEngineActionCanvas, isEngineActionHandlerAdd, isEngineActionHandlerAddKey, isEngineActionHandlerComplete } from '@ogod/game-core';
import { Subject, filter } from 'rxjs';
import { GameEngineSource } from '../driver/state';

export function makeActionListenerEngine<C = OffscreenCanvas>(params: {
    source: GameEngineSource<any, any, C>,
    workerContext?: DedicatedWorkerGlobalScope
}) {
    // Handler Add
    params.source.actionHandler['engine'].pipe(
        filter(isEngineActionHandlerAdd)
    ).subscribe(({ payload }) => Object.assign(params.source.actionHandler, payload));
    // Handler add by key
    params.source.actionHandler['engine'].pipe(
        filter(isEngineActionHandlerAddKey)
    ).subscribe(({ payload }) => Object.assign(params.source.actionHandler, { [payload]: new Subject<any>() }));
    // Handler complete and remove
    params.source.actionHandler['engine'].pipe(
        filter(isEngineActionHandlerComplete)
    ).subscribe(({ payload }) => {
        params.source.actionHandler[payload].complete();
        delete params.source.actionHandler[payload];
    });
    params.source.actionHandler['engine'].pipe(
        filter(isEngineActionCanvas<C>)
    ).subscribe(({ payload }) => {
        params.source.target$.next(payload);
    });
    if (params.workerContext) {
        params.source.actionHandler['engine'].pipe(
            filter((action) => action.type === 'OGOD_ENGINE_CLOSE')
        ).subscribe(() => params.workerContext!.close());
    }
}
