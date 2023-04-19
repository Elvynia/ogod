import { isEngineActionCanvas } from '@ogod/game-core';
import { makeDriverGameEngine, makeUpdate$ } from '@ogod/game-engine-driver';
import { gameRun } from '@ogod/game-run';
import { filter, first, merge, startWith, switchMap, tap } from 'rxjs';
import { makeFeatureData } from './app/data/make';
import { makeFeatureGenerator } from './app/generator/make';
import { makeFeatureOffset } from './app/offset/make';
import { makeRenderer$ } from './app/render/make';
import { makeFeatureScale } from './app/scale/make';
import { ActionKeys, WorkerSinks, WorkerSources } from './app/state';

declare var self: DedicatedWorkerGlobalScope;

function main(sources: WorkerSources): WorkerSinks {
    sources.GameEngine.actionHandlers.engine.pipe(
        filter(isEngineActionCanvas),
        first(),
        switchMap(({ payload }) => sources.GameEngine.actionHandlers.camera.pipe(
            tap((app) => {
                payload.width = app.width;
                payload.height = app.height;
            })
        ))
    ).subscribe();
    const state = {
        generator: undefined,
        scale: undefined,
        offset: () => 0,
        data: undefined
    };
    return {
        GameEngine: {
            state$: merge(
                makeFeatureData(sources, state),
                makeFeatureGenerator(sources, state),
                makeFeatureScale(sources, state),
                makeFeatureOffset(sources, state)
            ).pipe(
                startWith(state)
            ),
            renderer$: makeRenderer$(sources),
            update$: makeUpdate$()
        }
    };
}

self.close = gameRun(main, {
    GameEngine: makeDriverGameEngine({
        actionKeys: ActionKeys,
        workerContext: self
    })
});
