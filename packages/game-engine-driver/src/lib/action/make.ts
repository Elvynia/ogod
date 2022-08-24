import { FeatureState, GameEngineSource, isEngineActionCanvas, isEngineActionHandlerAdd, isEngineActionHandlerAddKey, isEngineActionHandlerComplete } from '@ogod/game-core';
import { filter, Subject } from 'rxjs';

export function makeEngineActionHandlers<S extends FeatureState>(sources: GameEngineSource<S>) {
    // Handler Add
    sources.action$.engine.pipe(
        filter(isEngineActionHandlerAdd)
    ).subscribe(({ handler }) => Object.assign(sources.options.actionHandlers, handler));
    // Handler add by key
    sources.action$.engine.pipe(
        filter(isEngineActionHandlerAddKey)
    ).subscribe(({ key }) => Object.assign(sources.options.actionHandlers, { [key]: new Subject<any>() }));
    // Handler complete and remove
    sources.action$.engine.pipe(
        filter(isEngineActionHandlerComplete)
    ).subscribe(({ key }) => {
        sources.options.actionHandlers[key].complete();
        delete sources.options.actionHandlers[key];
    });
    // Canvas
    if (sources.options.makeRender) {
        sources.action$.engine.pipe(
            filter(isEngineActionCanvas)
        ).subscribe(({ canvas }) => {
            const render = sources.options.makeRender!(canvas);
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
