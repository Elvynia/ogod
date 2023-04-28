import { makeGameBox2dDriver } from '@ogod/game-box2d-driver';
import { makeDriverGameEngine, makeFeature$, makeGame$, makeReflect$, makeUpdate$ } from '@ogod/game-engine-driver';
import { gameRun } from '@ogod/game-run';
import { ActionSubjectDefault } from 'packages/game-engine-driver/src/lib/action/state';
import { EMPTY, distinctUntilChanged, filter, first, map, merge, share, switchMap, withLatestFrom } from 'rxjs';
import { makeFeatureFps } from './app/fps';
import { makeGrounds } from './app/ground/make';
import { makeFeatureObjects } from './app/object/make';
import { makeFeaturePlayer } from './app/player/make';
import { makeRenderer$ } from './app/renderer/make';
import { makeFeatureCamera } from './app/screen/make';
import { ActionHandlers, AppState, WorkerSinks, WorkerSources } from './app/state';

declare var self: DedicatedWorkerGlobalScope;

function main(sources: WorkerSources): WorkerSinks {
    const target = {
        fps: 0,
        paused: false,
        objects: {}
    } as AppState;
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
                switchMap(() => makeReflect$({
                    state$: sources.GameEngine.state$,
                    buffer$: update$,
                    transform: (state) => ({
                        fps: state.fps,
                        objects: Object.values(state.objects || {}).map(({ id, x, y, width, height, health, body, colorLight }) => ({
                            id,
                            x,
                            y,
                            width,
                            height,
                            health,
                            angle: -body.GetAngle(),
                            colorLight
                        }))
                    })
                }))
            ),
            renderer$: makeRenderer$(sources),
            state$: merge(
                makeFeatureFps(sources.GameEngine, target),
                makeFeature$({
                    key: 'paused',
                    value$: sources.GameEngine.action$.getHandler('paused'),
                    target
                }),
                makeFeatureCamera(sources, target),
                sources.GameEngine.state$.pipe(
                    filter((state) => !!state.camera),
                    first(),
                    withLatestFrom(sources.GameEngine.renderTarget$),
                    switchMap(([state, canvas]) => {
                        state.grounds = makeGrounds(sources, state.camera, canvas.getContext('2d'));
                        return merge(
                            makeFeaturePlayer(sources, state),
                            makeFeatureObjects(sources, state)
                        );
                    })
                )
            )
        },
        World: {
            update$
        }
    };
}

self.close = gameRun(main, {
    GameEngine: makeDriverGameEngine({
        action$: new ActionSubjectDefault(new ActionHandlers()),
        workerContext: self
    }),
    World: makeGameBox2dDriver()
});
