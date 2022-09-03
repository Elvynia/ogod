import { isEngineActionCanvas } from '@ogod/game-core';
import { makeGameEngineDriver, makeGameEngineOptions, makeRenderer } from '@ogod/game-engine-driver';
import { gameRun } from '@ogod/game-run';
import { gsap } from 'gsap';
import { filter, map, merge, of } from 'rxjs';
import { makeFeatureObjects } from './app/objects';
import { makeRender } from './app/render';
import { makeFeatureScreen } from './app/screen';
import { WorkerSources } from './app/state';

declare var self: DedicatedWorkerGlobalScope;

function main(sources: WorkerSources) {
    gsap.ticker.remove(gsap.updateRoot);
    sources.GameEngine.frame$.subscribe(({ elapsed }) => gsap.updateRoot(elapsed / 1000));
    return {
        GameEngine: {
            runtime$: merge(
                of(makeFeatureScreen(sources.GameEngine)),
                of(makeFeatureObjects(sources.GameEngine))
            ),
            reflector$: of((state) => ({
                objects: Object.keys(state.objects).length
            })),
            renderer$: sources.GameEngine.actions.engine.pipe(
                filter(isEngineActionCanvas),
                map(({ payload }) => makeRenderer(makeRender(payload)))
            )
        }
    };
}

let options = makeGameEngineOptions(self, ['screen', 'objects', 'reset']);
options.dispose = gameRun(main, {
    GameEngine: makeGameEngineDriver(options)
});
