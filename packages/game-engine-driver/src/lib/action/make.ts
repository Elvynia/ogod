import { isEngineActionCanvas, isEngineActionHandlerAdd, isEngineActionHandlerAddKey, isEngineActionHandlerComplete } from '@ogod/game-core';
import { Subject, filter } from 'rxjs';
import { GameEngineSource } from '../driver/state';

export function makeActionListenerEngine<C = OffscreenCanvas>(params: {
    source: GameEngineSource<any, any, C>,
    workerContext?: DedicatedWorkerGlobalScope
}) {
    // Handler Add
    params.source.actionHandlers['engine'].pipe(
        filter(isEngineActionHandlerAdd)
    ).subscribe(({ payload }) => Object.assign(params.source.actionHandlers, payload));
    // Handler add by key
    params.source.actionHandlers['engine'].pipe(
        filter(isEngineActionHandlerAddKey)
    ).subscribe(({ payload }) => Object.assign(params.source.actionHandlers, { [payload]: new Subject<any>() }));
    // Handler complete and remove
    params.source.actionHandlers['engine'].pipe(
        filter(isEngineActionHandlerComplete)
    ).subscribe(({ payload }) => {
        params.source.actionHandlers[payload].complete();
        delete params.source.actionHandlers[payload];
    });
    params.source.actionHandlers['engine'].pipe(
        filter(isEngineActionCanvas<C>)
    ).subscribe(({ payload }) => {
        params.source.renderTarget$.next(payload);
    });
    if (params.workerContext) {
        params.source.actionHandlers['engine'].pipe(
            filter((action) => action.type === 'OGOD_ENGINE_CLOSE')
        ).subscribe(() => params.workerContext!.close());
    }
}
