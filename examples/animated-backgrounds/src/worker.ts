import { makeDriverEngine, makeStateObject } from '@ogod/driver-engine';
import { run } from '@ogod/run';
import { ActionSubjectDefault } from 'packages/driver-engine/src/lib/action/state';
import { first, map, of, switchMap } from 'rxjs';
import { makeFeatureObjects } from './app/object/make';
import { makeRenderer$ } from './app/renderer/make';
import { ActionHandlers, AppState, WorkerSinks, WorkerSources } from './app/state';

declare var self: DedicatedWorkerGlobalScope;

function main(sources: WorkerSources): WorkerSinks {
    return {
        Engine: {
            reflect$: sources.Engine.state$.pipe(
                first(),
                switchMap((state) => sources.Engine.engine$.reflect$.pipe(
                    map(() => ({
                        objects: Object.keys(state.objects).length
                    }))
                ))
            ),
            render$: makeRenderer$(sources),
            state$: makeStateObject({
                key$: of(
                    makeFeatureObjects(sources)
                ),
                state: {} as AppState
            })
        }
    };
}

run(main, {
    Engine: makeDriverEngine({
        action$: new ActionSubjectDefault(new ActionHandlers()),
        workerContext: self
    })
}, self);
