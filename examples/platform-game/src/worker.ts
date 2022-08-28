import { makeGameBox2dDriver, makeGameBox2dOptions } from '@ogod/game-box2d-driver';
import { isEngineActionCanvas } from '@ogod/game-core';
import { makeGameEngineDriver, makeGameEngineOptions } from '@ogod/game-engine-driver';
import { gameRun } from '@ogod/game-run';
import { concat, filter, map, of } from "rxjs";
import { makeRender } from './app/render';
import { makeIntroScene } from './app/scenes/intro';
import { makePlayScene } from './app/scenes/play';
import { AppReflectState, AppState, WorkerSources } from './app/state';

declare var self: DedicatedWorkerGlobalScope;

function main(sources: WorkerSources) {
    return {
        GameEngine: {
            runtime$: concat(
                of(makeIntroScene(sources)),
                of(makePlayScene(sources))
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

let options = makeGameEngineOptions<AppState>(self, ['camera', 'controls']);
options.dispose = gameRun(main, {
    GameEngine: makeGameEngineDriver(options),
    World: makeGameBox2dDriver(makeGameBox2dOptions({ x: 0, y: -10 }))
});
