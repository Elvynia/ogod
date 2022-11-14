import { startWith } from 'rxjs';
import { createNoise2D } from 'simplex-noise';
import { isEngineActionCanvas } from '@ogod/game-core';
import { makeGameEngineDriver, makeGameEngineOptions, makeUpdate$ } from '@ogod/game-engine-driver';
import { gameRun } from '@ogod/game-run';
import alea from 'alea';
import { filter, first, switchMap, tap } from 'rxjs';
import { makeFeatureNoises } from './app/noises/make';
import { makeRender$ } from './app/render/make';
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
    const seededAlea = alea('testwithalea');
    const constantNoise = createNoise2D(seededAlea);
    let o = 0;
    const state = {
        sources: [{
            generator: () => () => Math.random() * 2 - 1,
            scale: 1,
            offset: () => 0
        }, {
            generator: () => createNoise2D(seededAlea),
            scale: 1,
            offset: () => 0
        }, {
            generator: () => createNoise2D(seededAlea),
            scale: 0.1,
            offset: () => 0
        }, {
            generator: () => createNoise2D(seededAlea),
            scale: 0.01,
            offset: () => 0
        }, {
            generator: () => createNoise2D(seededAlea),
            scale: 0.004,
            offset: () => 0
        }, {
            generator: () => constantNoise,
            scale: 0.01,
            offset: () => o += 0.05
        }],
        noises: []
    };
    return {
        GameEngine: {
            feature$: makeFeatureNoises(sources, state).pipe(
                startWith(state)
            ),
            // reflect$: ,
            render$: makeRender$(sources),
            update$: makeUpdate$(sources.GameEngine)
        }
    };
}

let options = makeGameEngineOptions<AppState, AppAction, AppReflectState>(self, ['camera']);
options.dispose = gameRun(main, {
    GameEngine: makeGameEngineDriver(options)
});
