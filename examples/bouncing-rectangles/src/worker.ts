import { makeGameBox2dDriver } from '@ogod/game-box2d-driver';
import { makeDriverGameEngine, makeFeature$, makeReflect$, makeUpdate$ } from '@ogod/game-engine-driver';
import { gameRun } from '@ogod/game-run';
import { EMPTY, distinctUntilChanged, filter, first, map, merge, share, switchMap, withLatestFrom } from 'rxjs';
import { makeFeatureFps } from './app/fps';
import { makeGrounds } from './app/ground/make';
import { makeFeatureObjects } from './app/object/make';
import { makeFeaturePlayer } from './app/player/make';
import { makeRenderer$ } from './app/renderer/make';
import { makeFeatureCamera } from './app/screen/make';
import { ActionKeys, AppState, WorkerSinks, WorkerSources } from './app/state';

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
            // FIXME: check perfs vs not using share.
            share()
        ))
    );
    return {
        GameEngine: {
            reflect$: sources.GameEngine.state$.pipe(
                filter((state) => state.camera && state.player && !!state.objects),
                first(),
                switchMap((state) => makeReflect$({
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
                    value$: sources.GameEngine.actionHandlers.paused,
                    target
                }),
                makeFeatureCamera(sources, target),
                sources.GameEngine.state$.pipe(
                    filter((state) => !!state.camera),
                    first(),
                    withLatestFrom(sources.GameEngine.target$),
                    switchMap(([state, canvas]) => {
                        state.grounds = makeGrounds(sources, state.camera, canvas.getContext('2d'));
                        return merge(
                            makeFeaturePlayer(sources, state),
                            makeFeatureObjects(sources, state)
                        );
                    })
                )
            ),
            update$
        },
        World: {
            update$
        }
    };
}

self.close = gameRun(main, {
    GameEngine: makeDriverGameEngine({
        actionKeys: ActionKeys,
        workerContext: self
    }),
    World: makeGameBox2dDriver()
});
