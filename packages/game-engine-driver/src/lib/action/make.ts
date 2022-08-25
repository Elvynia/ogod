import { GameEngineSource, isEngineActionCanvas, isEngineActionHandlerAdd, isEngineActionHandlerAddKey, isEngineActionHandlerComplete } from '@ogod/game-core';
import { filter, Subject } from 'rxjs';

export function makeEngineActionHandlers(sources: GameEngineSource<any>) {
    // Handler Add
    sources.action$.engine.pipe(
        filter(isEngineActionHandlerAdd)
    ).subscribe(({ payload }) => Object.assign(sources.options.actionHandlers, payload));
    // Handler add by key
    sources.action$.engine.pipe(
        filter(isEngineActionHandlerAddKey)
    ).subscribe(({ payload }) => Object.assign(sources.options.actionHandlers, { [payload]: new Subject<any>() }));
    // Handler complete and remove
    sources.action$.engine.pipe(
        filter(isEngineActionHandlerComplete)
    ).subscribe(({ payload }) => {
        sources.options.actionHandlers[payload].complete();
        delete sources.options.actionHandlers[payload];
    });
    // Canvas
    if (sources.options.makeRender) {
        sources.action$.engine.pipe(
            filter(isEngineActionCanvas)
        ).subscribe(({ payload }) => {
            const render = sources.options.makeRender!(payload);
            sources.render$.subscribe(([delta, state]) => render(delta, state));
        });
    }
    // Close
    const actualClose = sources.options.workerContext!.close;
    sources.options.workerContext!.close = () => {
        sources.options.dispose && sources.options.dispose();
        actualClose();
    };
    sources.action$.engine.pipe(
        filter((action) => action.type === 'OGOD_ENGINE_CLOSE')
    ).subscribe(() => sources.options.workerContext!.close());
}
