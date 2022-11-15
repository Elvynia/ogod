import { isEngineActionCanvas } from '@ogod/game-core';
import { makeGameEngineDriver, makeGameEngineOptions, makeUpdate$ } from '@ogod/game-engine-driver';
import { gameRun } from '@ogod/game-run';
import { filter, first, merge, startWith, switchMap, tap } from 'rxjs';
import { makeFeatureData } from './app/data/make';
import { makeFeatureGenerator } from './app/generator/make';
import { makeFeatureOffset } from './app/offset/make';
import { makeRender$ } from './app/render/make';
import { makeFeatureScale } from './app/scale/make';
import { AppAction, AppReflectState, AppState, WorkerSinks, WorkerSources } from './app/state';

declare var self: DedicatedWorkerGlobalScope;

function main(sources: WorkerSources): WorkerSinks {
    sources.GameEngine.actions.engine.pipe(
        filter(isEngineActionCanvas),
        first(),
        switchMap(({ payload }) => sources.GameEngine.actions.camera.pipe(
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
            feature$: merge(
                makeFeatureData(sources, state),
                makeFeatureGenerator(sources, state),
                makeFeatureScale(sources, state),
                makeFeatureOffset(sources, state)
            ).pipe(
                startWith(state)
            ),
            // reflect$: ,
            render$: makeRender$(sources),
            update$: makeUpdate$(sources.GameEngine)
        }
    };
}

let options = makeGameEngineOptions<AppState, AppAction, AppReflectState>(self, ['camera', 'generator', 'scale', 'offset']);
options.dispose = gameRun(main, {
    GameEngine: makeGameEngineDriver(options)
});
