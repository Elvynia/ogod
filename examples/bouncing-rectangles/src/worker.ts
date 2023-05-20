import { makeGameBox2dDriver } from '@ogod/game-box2d-driver';
import { makeDriverGameEngine, makeFeatureObject$, makeGame$, makeUpdate$ } from '@ogod/game-engine-driver';
import { gameRun } from '@ogod/game-run';
import { ActionSubjectDefault } from 'packages/game-engine-driver/src/lib/action/state';
import { EMPTY, distinctUntilChanged, filter, first, map, of, share, switchMap } from 'rxjs';
import { makeFeatureCamera } from './app/camera/make';
import { makeFeatureFps } from './app/fps';
import { makeFeatureGrounds } from './app/ground/make';
import { makeFeatureObjects } from './app/object/make';
import { makeFeaturePaused } from './app/paused/make';
import { makeFeaturePlayer } from './app/player/make';
import { makeRenderer$ } from './app/renderer/make';
import { ActionHandlers, AppState, WorkerSinks, WorkerSources } from './app/state';

declare var self: DedicatedWorkerGlobalScope;

function main(sources: WorkerSources): WorkerSinks {
    const update$ = sources.GameEngine.state$.pipe(
        map((state) => state.paused),
        distinctUntilChanged(),
        switchMap((paused) => paused ? EMPTY : makeUpdate$(0).pipe(
            share()
        ))
    );
    return {
        GameEngine: {
            game$: makeGame$({
                state$: sources.GameEngine.state$,
                update$
            }),
            reflect$: sources.GameEngine.state$.pipe(
                filter((state) => state.camera && state.player && !!state.objects),
                first(),
                switchMap(() => sources.GameEngine.game$.pipe(
                    map(([_, state]) => ({
                        fps: state.fps,
                        objects: Object.values(state.objects || {})
                            .map(({ id, x, y, width, height, health, body, colorLight }) => ({
                                id, x, y, width, height, health, angle: -body.GetAngle(), colorLight
                            }))
                    }))
                ))
            ),
            renderer$: makeRenderer$(sources),
            state$: makeFeatureObject$({
                key$: of(
                    makeFeatureCamera(sources),
                    makeFeatureFps(sources),
                    makeFeatureGrounds(sources),
                    makeFeaturePaused(sources),
                    makeFeaturePlayer(sources),
                    makeFeatureObjects(sources)
                ),
                state$: of({} as AppState)
            })
        },
        World: {
            update$
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
