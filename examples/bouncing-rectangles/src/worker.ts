import { makeGameBox2dDriver } from '@ogod/game-box2d-driver';
import { EngineSubjectDefault, makeDriverGameEngine, makeStateObject, makeUpdate$ } from '@ogod/game-engine-driver';
import { gameRun } from '@ogod/game-run';
import { ActionSubjectDefault } from 'packages/game-engine-driver/src/lib/action/state';
import { EMPTY, distinctUntilChanged, filter, first, map, of, switchMap } from 'rxjs';
import { makeFeatureCamera } from './app/camera/make';
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
        GameEngine: {
            reflect$: sources.GameEngine.state$.pipe(
                filter((state) => state.camera && state.player && !!state.objects),
                first(),
                switchMap((state) => sources.GameEngine.engine$.reflect$.pipe(
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
                    makeFeatureCamera(sources),
                    makeFeatureFps(sources),
                    makeFeatureGrounds(sources),
                    makeFeaturePaused(sources),
                    makeFeaturePlayer(sources),
                    makeFeatureObjects(sources)
                ),
                state: {} as AppState
            }),
            systems: {
                pre$: sources.GameEngine.state$.pipe(
                    filter((s) => s.player && !!s.objects),
                    first(),
                    map((state) => [() => {
                        for (let id in state.objects) {
                            updateMovement(state.objects[id], state.camera);
                        }
                        updateMovement(state.player, state.camera);
                    }])
                )
            }
        },
        World: {
            update$: sources.GameEngine.state$.pipe(
                map((state) => state.paused),
                distinctUntilChanged(),
                switchMap((paused) => paused ? EMPTY : sources.GameEngine.engine$)
            )
        }
    };
}

gameRun(main, {
    GameEngine: makeDriverGameEngine({
        action$: new ActionSubjectDefault(new ActionHandlers()),
        engine$: new EngineSubjectDefault(makeUpdate$(0)),
        workerContext: self
    }),
    World: makeGameBox2dDriver()
}, self);
