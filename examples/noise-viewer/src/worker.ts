import { makeActionSubjectParams, makeDriverGameEngine, makeGameEngineOptionsDefaults } from '@ogod/game-engine-driver';
import { gameRun } from '@ogod/game-run';
import { ActionSubjectDefault } from 'packages/game-engine-driver/src/lib/action/state';
import { merge, startWith, withLatestFrom } from 'rxjs';
import { makeFeatureData } from './app/data/make';
import { makeFeatureGenerator } from './app/generator/make';
import { makeFeatureOffset } from './app/offset/make';
import { makeRenderer$ } from './app/render/make';
import { makeFeatureScale } from './app/scale/make';
import { ActionKeys, WorkerSinks, WorkerSources } from './app/state';

declare var self: DedicatedWorkerGlobalScope;

function main(sources: WorkerSources): WorkerSinks {
    sources.GameEngine.action$.handlers.camera.pipe(
        withLatestFrom(sources.GameEngine.renderTarget$)
    ).subscribe(([app, canvas]) => {
        canvas.width = app.width;
        canvas.height = app.height;
    });
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
            renderer$: makeRenderer$(sources)
        }
    };
}

self.close = gameRun(main, {
    GameEngine: makeDriverGameEngine({
        ...makeGameEngineOptionsDefaults(),
        action$: new ActionSubjectDefault(makeActionSubjectParams(ActionKeys)),
        workerContext: self
    })
});
