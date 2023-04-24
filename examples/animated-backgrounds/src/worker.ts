import { makeActionSubjectParams, makeDriverGameEngine, makeGameEngineOptionsDefaults, makeReflect$ } from '@ogod/game-engine-driver';
import { gameRun } from '@ogod/game-run';
import { gsap } from 'gsap';
import { ActionSubjectDefault } from 'packages/game-engine-driver/src/lib/action/state';
import { merge } from 'rxjs';
import { makeFeatureCamera } from './app/camera/make';
import { makeFeatureObjects } from './app/object/make';
import { makeRenderer$ } from './app/renderer/make';
import { ActionKeys, AppState, WorkerSinks, WorkerSources } from './app/state';

declare var self: DedicatedWorkerGlobalScope;

function main(sources: WorkerSources): WorkerSinks {
    const state = {
        objects: {}
    } as AppState;
    gsap.ticker.remove(gsap.updateRoot);
    sources.GameEngine.game$.subscribe(([{ elapsed }]) => gsap.updateRoot(elapsed / 1000));
    return {
        GameEngine: {
            reflect$: makeReflect$({
                state$: sources.GameEngine.state$,
                buffer$: sources.GameEngine.game$,
                transform: (state) => ({
                    objects: Object.keys(state.objects).length
                })
            }),
            renderer$: makeRenderer$(sources),
            state$: merge(
                makeFeatureCamera(sources, state),
                makeFeatureObjects(sources, state)
            )
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
