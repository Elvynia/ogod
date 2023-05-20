import { makeDriverGameEngine, makeFeatureObject$ } from '@ogod/game-engine-driver';
import { gameRun } from '@ogod/game-run';
import { ActionSubjectDefault } from 'packages/game-engine-driver/src/lib/action/state';
import { of, withLatestFrom } from 'rxjs';
import { makeFeatureData } from './app/data/make';
import { makeFeatureGenerator } from './app/generator/make';
import { makeFeatureOffset } from './app/offset/make';
import { makeRenderer$ } from './app/render/make';
import { makeFeatureScale } from './app/scale/make';
import { ActionHandlers, AppState, WorkerSinks, WorkerSources } from './app/state';

declare var self: DedicatedWorkerGlobalScope;

function main(sources: WorkerSources): WorkerSinks {
    sources.GameEngine.action$.getHandler('camera').pipe(
        withLatestFrom(sources.GameEngine.renderTarget$)
    ).subscribe(([camera, canvas]) => {
        canvas.width = camera.width;
        canvas.height = camera.height;
    });
    return {
        GameEngine: {
            renderer$: makeRenderer$(sources),
            state$: makeFeatureObject$({
                key$: of(
                    makeFeatureData(sources),
                    makeFeatureGenerator(sources),
                    makeFeatureOffset(sources),
                    makeFeatureScale(sources)
                ),
                state$: of({} as AppState)
            })
        }
    };
}

gameRun(main, {
    GameEngine: makeDriverGameEngine({
        action$: new ActionSubjectDefault(new ActionHandlers()),
        workerContext: self
    })
}, self);
