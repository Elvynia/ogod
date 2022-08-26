import { makeGameBox2dDriver, makeGameBox2dOptions } from '@ogod/game-box2d-driver';
import { makeGameEngineDriver, makeGameEngineOptions } from '@ogod/game-engine-driver';
import { gameRun } from '@ogod/game-run';
import { of } from "rxjs";
import { makeFeatureFps } from './app/fps';
import { makeRender } from './app/render';
import { makeShapes$ } from './app/shape/make';
import { AppActions, AppState, WorkerSources } from './app/state';

declare var self: DedicatedWorkerGlobalScope;

function main(sources: WorkerSources) {
    return {
        GameEngine: of({
            app$: sources.GameEngine.action$.app.asObservable(),
            controls$: sources.GameEngine.action$.controls.asObservable(),
            fps$: makeFeatureFps(sources.GameEngine),
            shapes$: makeShapes$(sources)
        }),
        World: sources.GameEngine.update$
    }
}

let options = {
    ...makeGameEngineOptions<AppState, AppActions>(['app', 'controls']),
    workerContext: self,
    reflectHandler: of(({ fps }) => ({ fps })),
    makeRender
}
options.dispose = gameRun(main, {
    GameEngine: makeGameEngineDriver(options),
    World: makeGameBox2dDriver(makeGameBox2dOptions({ x: 0, y: -10 }))
});
