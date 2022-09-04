import { makeGameBox2dDriver, makeGameBox2dOptions } from '@ogod/game-box2d-driver';
import { isEngineActionCanvas } from '@ogod/game-core';
import { makeFeature$, makeGameEngineDriver, makeGameEngineOptions, makeRenderer } from '@ogod/game-engine-driver';
import { gameRun } from '@ogod/game-run';
import gsap from 'gsap';
import { concat, concatMap, delayWhen, filter, first, map, merge, of, switchMap } from "rxjs";
import { makeFeatureCamera$ } from './app/camera/make';
import { makeFeatureFps } from './app/fps';
import { makeRender } from './app/render';
import { makeIntroScene } from './app/scenes/intro';
import { makePlayScene } from './app/scenes/play';
import { makeSplashScene } from './app/scenes/splash';
import { AppAction, AppReflectState, AppState, WorkerSources } from './app/state';

declare var self: DedicatedWorkerGlobalScope;

function main(sources: WorkerSources) {
    gsap.ticker.remove(gsap.updateRoot);
    sources.GameEngine.frame$.subscribe(({ elapsed }) => gsap.updateRoot(elapsed / 1000));
    const state = {
        gmap: {
            platforms: {},
            width: 20,
            height: 5,
            scale: 10
        }
    } as AppState;
    return {
        GameEngine: {
            runtime$: merge(
                makeFeature$(merge(
                    makeFeatureCamera$(sources),
                    of(makeFeatureFps(sources.GameEngine))
                ), state),
                makeFeature$(concat(
                    of(makeSplashScene(sources)),
                    of(makeIntroScene(sources)),
                    of(makePlayScene(sources))
                ), state, concatMap)
            ),
            reflector$: of(({ fps, loading }) => ({ fps, loading } as AppReflectState)),
            renderer$: sources.GameEngine.actions.engine.pipe(
                filter(isEngineActionCanvas),
                switchMap(({ payload }) => {
                    const renderers = makeRender(payload);
                    return concat(
                        sources.GameEngine.state$.pipe(
                            filter((s) => !!s.splash),
                            first(),
                            map(() => makeRenderer(renderers.splash, sources.GameEngine.state$.pipe(
                                filter((state) => !state.splash),
                                first()
                            )))
                        ),
                        of(makeRenderer(renderers.play)).pipe(
                            delayWhen(() => sources.GameEngine.state$.pipe(
                                filter((state) => !!state.shapes),
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

let options = makeGameEngineOptions<AppState, AppAction>(self, ['camera', 'controls']);
options.dispose = gameRun(main, {
    GameEngine: makeGameEngineDriver(options),
    World: makeGameBox2dDriver(makeGameBox2dOptions({ x: 0, y: -10 }))
});
