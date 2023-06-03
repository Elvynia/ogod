import { makeDriverGameEngine, makeStateObject } from '@ogod/driver-engine';
import { run } from '@ogod/run';
import { ActionSubjectDefault } from 'packages/driver-engine/src/lib/action/state';
import { first, map, of, switchMap } from 'rxjs';
import { makeFeatureCamera } from './app/camera/make';
import { makeFeatureObjects } from './app/object/make';
import { makeRenderer$ } from './app/renderer/make';
import { ActionHandlers, AppState, WorkerSinks, WorkerSources } from './app/state';

declare var self: DedicatedWorkerGlobalScope;

function main(sources: WorkerSources): WorkerSinks {
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
            })
        }
    };
}

run(main, {
    GameEngine: makeDriverGameEngine({
        action$: new ActionSubjectDefault(new ActionHandlers()),
        workerContext: self
    })
}, self);
