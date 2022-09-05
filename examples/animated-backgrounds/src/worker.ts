import { ReflectState } from '@ogod/game-core';
import { makeFeature$, makeFeatureArray, makeGameEngineDriver, makeGameEngineOptions, makeRuntime } from '@ogod/game-engine-driver';
import { gameRun } from '@ogod/game-run';
import { gsap } from 'gsap';
import { of } from 'rxjs';
import { makeFeatureObjects } from './app/objects';
import { makeRender$ } from './app/render';
import { makeFeatureScreen } from './app/screen';
import { AppAction, AppState, WorkerSinks, WorkerSources } from './app/state';

declare var self: DedicatedWorkerGlobalScope;

function main(sources: WorkerSources): WorkerSinks {
    gsap.ticker.remove(gsap.updateRoot);
    sources.GameEngine.frame$.subscribe(({ elapsed }) => gsap.updateRoot(elapsed / 1000));
    return {
        GameEngine: {
            feature$: makeFeature$(of(makeFeatureArray([
                makeFeatureScreen(sources.GameEngine),
                makeFeatureObjects(sources.GameEngine)
            ]))),
            reflect$: of(makeRuntime<ReflectState>((state) => ({
                objects: Object.keys(state.objects).length
            }))),
            render$: makeRender$(sources)
        }
    };
}

let options = makeGameEngineOptions<AppState, AppAction>(self, ['screen', 'objects', 'reset']);
options.dispose = gameRun(main, {
    GameEngine: makeGameEngineDriver(options)
});
