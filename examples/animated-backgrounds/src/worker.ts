import { FeatureObject, makeDriverGameEngine, makeFeatureObject$, makeReflect$ } from '@ogod/game-engine-driver';
import { gameRun } from '@ogod/game-run';
import { gsap } from 'gsap';
import { ActionSubjectDefault } from 'packages/game-engine-driver/src/lib/action/state';
import { of } from 'rxjs';
import { makeFeatureCamera } from './app/camera/make';
import { makeFeatureObjects } from './app/object/make';
import { makeRenderer$ } from './app/renderer/make';
import { ActionHandlers, AppState, WorkerSinks, WorkerSources } from './app/state';

declare var self: DedicatedWorkerGlobalScope;

function main(sources: WorkerSources): WorkerSinks {
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
            state$: makeFeatureObject$({
                key$: of(
                    makeFeatureCamera(sources),
                    makeFeatureObjects(sources)
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
