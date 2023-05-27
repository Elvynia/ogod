import { makeGameBox2dDriver } from '@ogod/game-box2d-driver';
import { makeDriverGameEngine, makeGame$, makeStateObject, makeUpdate$ } from '@ogod/game-engine-driver';
import { gameRun } from '@ogod/game-run';
import { ActionSubjectDefault } from 'packages/game-engine-driver/src/lib/action/state';
import { EMPTY, distinctUntilChanged, filter, first, map, of, share, switchMap } from 'rxjs';
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
    sources.GameEngine.state$.pipe(
        filter((s) => s.player && !!s.objects),
        first(),
        switchMap(() => sources.GameEngine.game$)
    ).subscribe(([_, state]) => {
        for (let id in state.objects) {
            updateMovement(state.objects[id], state.camera);
        }
        updateMovement(state.player, state.camera);
    });
    sources.World.contact$.pipe(
        filter((contact) => contact.touching === 1),
        map(({ dataA, dataB }) => [dataA, dataB].filter((data) => !!data))
    ).subscribe((healths) => healths.forEach((h) => h.next(h.value - 1)));
    return {
        GameEngine: {
            game$: makeGame$({
                state$: sources.GameEngine.state$,
                update$: sources.GameEngine.state$.pipe(
                    map((state) => state.paused),
                    distinctUntilChanged(),
                    switchMap((paused) => paused ? EMPTY : makeUpdate$(0).pipe(
                        share()
                    ))
                )
            }),
            reflect$: sources.GameEngine.state$.pipe(
                filter((state) => state.camera && state.player && !!state.objects),
                first(),
                switchMap(() => sources.GameEngine.game$.pipe(
                    map(([_, state]) => {
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
            renderer$: makeRenderer$(sources),
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
            })
        },
        World: {
            update$: sources.GameEngine.game$.pipe(
                map(([delta]) => delta)
            )
        }
    };
}

gameRun(main, {
    GameEngine: makeDriverGameEngine({
        action$: new ActionSubjectDefault(new ActionHandlers()),
        workerContext: self
    }),
    World: makeGameBox2dDriver()
}, self);
