import { makeGameEngineDriver, makeGameEngineOptions, makeReflect$, makeUpdate$ } from '@ogod/game-engine-driver';
import { gameRun } from '@ogod/game-run';
import { gsap } from 'gsap';
import { map, merge } from 'rxjs';
import { makeFeatureCamera } from './app/camera/make';
import { makeFeatureObjects } from './app/object/make';
import { makeRender$ } from './app/render/make';
import { AppAction, AppReflectState, AppState, WorkerSinks, WorkerSources } from './app/state';

declare var self: DedicatedWorkerGlobalScope;

function main(sources: WorkerSources): WorkerSinks {
    const state = {
        objects: {}
    } as AppState;
    gsap.ticker.remove(gsap.updateRoot);
    sources.GameEngine.frame$.subscribe(({ elapsed }) => gsap.updateRoot(elapsed / 1000));
    return {
        GameEngine: {
            feature$: merge(
                makeFeatureCamera(sources, state),
                makeFeatureObjects(sources, state)
            ),
            reflect$: makeReflect$(sources.GameEngine).pipe(
                map((state) => ({
                    objects: Object.keys(state.objects).length
                }))
            ),
            render$: makeRender$(sources),
            update$: makeUpdate$(sources.GameEngine)
        }
    };
}

let options = makeGameEngineOptions<AppState, AppAction, AppReflectState>(self, ['camera', 'objects', 'reset']);
options.dispose = gameRun(main, {
    GameEngine: makeGameEngineDriver(options)
});
