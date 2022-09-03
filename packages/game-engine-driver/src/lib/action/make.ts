import { GameEngineSource, isEngineActionCanvas, isEngineActionHandlerAdd, isEngineActionHandlerAddKey, isEngineActionHandlerComplete } from '@ogod/game-core';
import { filter, Subject } from 'rxjs';

export function makeEngineActionHandlers(sources: GameEngineSource) {
    // Handler Add
    sources.actions.engine.pipe(
        filter(isEngineActionHandlerAdd)
    ).subscribe(({ payload }) => Object.assign(sources.options.actionHandlers, payload));
    // Handler add by key
    sources.actions.engine.pipe(
        filter(isEngineActionHandlerAddKey)
    ).subscribe(({ payload }) => Object.assign(sources.options.actionHandlers, { [payload]: new Subject<any>() }));
    // Handler complete and remove
    sources.actions.engine.pipe(
        filter(isEngineActionHandlerComplete)
    ).subscribe(({ payload }) => {
        sources.options.actionHandlers[payload].complete();
        delete sources.options.actionHandlers[payload];
    });
    // Set canvas
    sources.actions.engine.pipe(
        filter(isEngineActionCanvas)
    ).subscribe(({ payload }) => {
        sources.canvas = payload;
    });
    // Close
    const actualClose = sources.options.workerContext!.close;
    sources.options.workerContext!.close = () => {
        sources.options.dispose && sources.options.dispose();
        actualClose();
    };
    sources.actions.engine.pipe(
        filter((action) => action.type === 'OGOD_ENGINE_CLOSE')
    ).subscribe(() => sources.options.workerContext!.close());
}
