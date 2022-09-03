import { makeGameBox2dDriver, makeGameBox2dOptions } from '@ogod/game-box2d-driver';
import { isEngineActionCanvas } from '@ogod/game-core';
import { makeFeatureConstant, makeGameEngineDriver, makeGameEngineOptions, makeRenderer } from '@ogod/game-engine-driver';
import { gameRun } from '@ogod/game-run';
import { concat, delayWhen, filter, first, map, of, switchMap, tap } from "rxjs";
import { makeFeatureCamera$ } from './app/camera/make';
import { makeFeatureFps } from './app/fps';
import { MapState } from './app/map/state';
import { makeRender } from './app/render';
import { makeFeatureScene } from './app/scenes/make';
import { AppReflectState, WorkerSources } from './app/state';

declare var self: DedicatedWorkerGlobalScope;

function main(sources: WorkerSources) {
    // gsap.ticker.remove(gsap.updateRoot);
    // sources.GameEngine.frame$.subscribe(({ elapsed }) => gsap.updateRoot(elapsed / 1000));
    const gmap: MapState = {
        platforms: {},
        width: 20,
        height: 5,
        scale: 10
    }
    return {
        GameEngine: {
            runtime$: concat(
                makeFeatureCamera$(sources),
                of(makeFeatureFps(sources.GameEngine)),
                of(makeFeatureConstant('gmap', gmap)),
                of(makeFeatureScene(sources))
            ),
            reflector$: of(({ fps, loading }) => ({ fps, loading } as AppReflectState)),
            renderer$: sources.GameEngine.actions.engine.pipe(
                filter(isEngineActionCanvas),
                switchMap(({ payload }) => {
                    const renderers = makeRender(payload);
                    return concat(
                        sources.GameEngine.state$.pipe(
                            filter((s) => s.splash),
                            first(),
                            map(() => makeRenderer(renderers.splash, sources.GameEngine.state$.pipe(
                                filter((state) => !state.splash),
                                first()
                            )))
                        ),
                        of(makeRenderer(renderers.play)).pipe(
                            delayWhen(() => sources.GameEngine.state$.pipe(
                                filter((state) => state.shapes),
                                first()
                            ))
                        )
                    );
                }),

            )
        },
        World: sources.GameEngine.update$
    }
}

let options = makeGameEngineOptions(self, ['camera', 'controls']);
options.dispose = gameRun(main, {
    GameEngine: makeGameEngineDriver(options),
    World: makeGameBox2dDriver(makeGameBox2dOptions({ x: 0, y: -10 }))
});
