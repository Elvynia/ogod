import { makeGameBox2dDriver, makeGameBox2dOptions } from '@ogod/game-box2d-driver';
import { Feature, isEngineActionCanvas } from '@ogod/game-core';
import { makeFeatureConstant, makeFeatureObservable, makeGameEngineDriver, makeGameEngineOptions } from '@ogod/game-engine-driver';
import { gameRun } from '@ogod/game-run';
import { concat, filter, first, map, of, switchMap } from "rxjs";
import { makeFeatureFps } from './app/fps';
import { makeFeatureLoadMap$ } from './app/map/make';
import { MapState } from './app/map/state';
import { makeRender } from './app/render';
import { makeFeatureScene } from './app/scenes/make';
import { makeShapes$ } from './app/shape/make';
import { AppReflectState, AppState, WorkerSources } from './app/state';

declare var self: DedicatedWorkerGlobalScope;

function main(sources: WorkerSources) {
    const gmap: MapState = {
        platforms: {},
        width: 20,
        height: 5,
        scale: 10
    }
    return {
        GameEngine: {
            runtime$: concat(
                of(makeFeatureFps(sources.GameEngine)),
                of(makeFeatureConstant('gmap', gmap)),
                of(makeFeatureScene(sources))
            ),
            reflector$: of(({ fps, loading }) => ({ fps, loading } as AppReflectState)),
            renderer$: sources.GameEngine.action$.engine.pipe(
                filter(isEngineActionCanvas),
                map(({ payload }) => makeRender(payload))
            )
        },
        World: sources.GameEngine.update$
    }
}

let options = makeGameEngineOptions(self, ['camera', 'controls']);
options.dispose = gameRun(main, {
    GameEngine: makeGameEngineDriver(options),
    World: makeGameBox2dDriver(makeGameBox2dOptions({ x: 0, y: -10 }))
});
