import { makeGameBox2dDriver, makeGameBox2dOptions } from '@ogod/game-box2d-driver';
import { makeGameEngineDriver, makeGameEngineOptions } from '@ogod/game-engine-driver';
import { gameRun } from '@ogod/game-run';
import { of } from "rxjs";
import { makeRender } from './app/render';
import { makeIntroScene } from './app/scenes/intro';
import { makePlayScene } from './app/scenes/play';
import { AppActions, AppState, WorkerSources } from './app/state';

declare var self: DedicatedWorkerGlobalScope;

function main(sources: WorkerSources) {
    return {
        // GameEngine: of(makePlayScene(sources)),
        GameEngine: of(makeIntroScene(sources)),
        World: sources.GameEngine.update$
    }
}

let options = {
    ...makeGameEngineOptions<AppState, AppActions>(['camera', 'controls']),
    workerContext: self,
    // TODO: Move reflect and render to sink for better use as observable.
    reflectHandler: of(({ fps, loading }) => ({ fps, loading })),
    makeRender
}
options.dispose = gameRun(main, {
    GameEngine: makeGameEngineDriver(options),
    World: makeGameBox2dDriver(makeGameBox2dOptions({ x: 0, y: -10 }))
});
