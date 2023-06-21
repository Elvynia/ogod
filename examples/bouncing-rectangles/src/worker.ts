import { makeDriverBox2d } from '@ogod/driver-box2d';
import { ActionSubjectDefault, makeDriverEngine, makeStateObject } from '@ogod/driver-engine';
import { run } from '@ogod/run';
import { EMPTY, distinctUntilChanged, filter, first, map, of, switchMap, withLatestFrom } from 'rxjs';
import { makeFeatureFps } from './app/fps';
import { makeFeatureGrounds } from './app/ground/make';
import { makeFeatureObjects, updateMovement } from './app/object/make';
import { makeFeaturePaused } from './app/paused/make';
import { makeFeaturePlayer } from './app/player/make';
import { makeRenderer$ } from './app/renderer/make';
import { ActionHandlers, AppState, WorkerSinks, WorkerSources } from './app/state';

declare var self: DedicatedWorkerGlobalScope;

function main(sources: WorkerSources): WorkerSinks {
    sources.World.contact$.pipe(
        filter((contact) => contact.touching === 1),
        map(({ dataA, dataB }) => [dataA, dataB].filter((data) => !!data))
    ).subscribe((healths) => healths.forEach((h) => h.next(h.value - 1)));
    return {
        Engine: {
            reflect$: sources.Engine.state$.pipe(
                filter((state) => state.player && !!state.objects),
                first(),
                switchMap((state) => sources.Engine.engine$.reflect$.pipe(
                    map(() => {
                        const objects = new Array();
                        for (let k in state.objects) {
                            const o = {
                                ...state.objects[k]
                            };
                            delete o.body;
                            delete o.id;
                            delete o.color;
                            delete o.dynamic;
                            objects.push(o);
                        }
                        return {
                            box2dCount: sources.World.instance.GetBodyCount(),
                            fps: state.fps,
                            objects
                        }
                    })
                ))
            ),
            render$: makeRenderer$(sources),
            state$: makeStateObject({
                key$: of(
                    makeFeatureFps(sources),
                    makeFeatureGrounds(sources),
                    makeFeaturePaused(sources),
                    makeFeaturePlayer(sources),
                    makeFeatureObjects(sources)
                ),
                state: {
                    scale: 10
                } as AppState
            }),
            systems: {
                pre$: sources.Engine.state$.pipe(
                    filter((s) => s.player && !!s.objects),
                    withLatestFrom(sources.Engine.target$),
                    first(),
                    map(([state, canvas]) => [() => {
                        for (let id in state.objects) {
                            updateMovement(state.objects[id], state, canvas);
                        }
                        updateMovement(state.player, state, canvas);
                    }])
                )
            }
        },
        World: {
            update$: sources.Engine.state$.pipe(
                map((state) => state.paused),
                distinctUntilChanged(),
                switchMap((paused) => paused ? EMPTY : sources.Engine.engine$)
            )
        }
    };
}

run(main, {
    Engine: makeDriverEngine({
        action$: new ActionSubjectDefault(new ActionHandlers()),
        workerContext: self
    }),
    World: makeDriverBox2d()
}, self);
