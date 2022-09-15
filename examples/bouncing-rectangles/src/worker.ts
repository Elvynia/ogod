import { makeGameBox2dDriver } from '@ogod/game-box2d-driver';
import { makeFeature$, makeGameEngineDriver, makeGameEngineOptions, makeReflect$, makeUpdate$ } from '@ogod/game-engine-driver';
import { gameRun } from '@ogod/game-run';
import { distinctUntilKeyChanged, EMPTY, filter, first, map, merge, ReplaySubject, switchMap, tap } from 'rxjs';
import { makeFeatureFps } from './app/fps';
import { makeGrounds } from './app/ground/make';
import { makeFeatureObjects } from './app/object/make';
import { makeFeaturePlayer } from './app/player/make';
import { makeRender$ } from './app/render/make';
import { makeFeatureCamera } from './app/screen/make';
import { AppAction, AppReflectState, AppState, WorkerSources } from './app/state';

declare var self: DedicatedWorkerGlobalScope;

function main(sources: WorkerSources) {
    const target = {
        fps: 0,
        paused: false,
        objects: {}
    } as AppState;
    return {
        GameEngine: {
            feature$: merge(
                makeFeatureFps(sources.GameEngine, target),
                makeFeature$({
                    key: 'paused',
                    value$: sources.GameEngine.actions.paused,
                    target
                }),
                makeFeatureCamera(sources, target),
                sources.GameEngine.state$.pipe(
                    filter((state) => !!state.camera),
                    first(),
                    switchMap((state) => {
                        state.grounds = makeGrounds(sources, state.camera);
                        return merge(
                            makeFeaturePlayer(sources, state),
                            makeFeatureObjects(sources, state)
                        );
                    })
                )
            ),
            reflect$: sources.GameEngine.state$.pipe(
                filter((state) => state.camera && state.player && !!state.objects),
                first(),
                switchMap((state) => makeReflect$(sources.GameEngine).pipe(
                    map(() => {
                        const values = Object.values(state.objects || {});
                        return {
                            fps: state.fps,
                            objectCount: values.length,
                            objects: values.map(({ id, x, y, width, height, health, body }) => ({
                                id,
                                x,
                                y,
                                width,
                                height,
                                health,
                                angle: -body.GetAngle()
                            }))
                        };
                    })
                ))
            ),
            render$: makeRender$(sources),
            update$: sources.GameEngine.state$.pipe(
                distinctUntilKeyChanged('paused'),
                map((state: any) => state.paused),
                switchMap((paused) => paused ? EMPTY : makeUpdate$(sources.GameEngine))
            )
        },
        World: {
            update$: sources.GameEngine.update$
        }
    };
}

let options = makeGameEngineOptions<AppState, AppAction, AppReflectState>(self, ['camera', 'objects', 'paused'], {
    playerColor: new ReplaySubject<string>(1)
});
options.dispose = gameRun(main, {
    GameEngine: makeGameEngineDriver(options),
    World: makeGameBox2dDriver()
});
