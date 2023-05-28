import { makeDriverGameEngine, makeStateObject } from '@ogod/game-engine-driver';
import { gameRun } from '@ogod/game-run';
import { gsap } from 'gsap';
import { ActionSubjectDefault } from 'packages/game-engine-driver/src/lib/action/state';
import { first, map, of, switchMap } from 'rxjs';
import { makeFeatureCamera } from './app/camera/make';
import { makeFeatureObjects } from './app/object/make';
import { makeRenderer$ } from './app/renderer/make';
import { ActionHandlers, AppState, WorkerSinks, WorkerSources } from './app/state';

declare var self: DedicatedWorkerGlobalScope;

function main(sources: WorkerSources): WorkerSinks {
    gsap.ticker.remove(gsap.updateRoot);
    return {
        GameEngine: {
            reflect$: sources.GameEngine.state$.pipe(
                first(),
                switchMap((state) => sources.GameEngine.engine$.reflect$.pipe(
                    map(() => ({
                        objects: Object.keys(state.objects).length
                    }))
                ))
            ),
            render$: makeRenderer$(sources),
            state$: makeStateObject({
                key$: of(
                    makeFeatureCamera(sources),
                    makeFeatureObjects(sources)
                ),
                state: {} as AppState
            }),
            system$: of([({ elapsed }) => gsap.updateRoot(elapsed / 1000)])
        }
    };
}

gameRun(main, {
    GameEngine: makeDriverGameEngine({
        action$: new ActionSubjectDefault(new ActionHandlers()),
        workerContext: self
    })
}, self);
