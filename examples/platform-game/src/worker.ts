import { makeGameBox2dDriver } from '@ogod/game-box2d-driver';
import { ReflectState } from '@ogod/game-core';
import { makeFeature$, makeFeatureObservable, makeGameEngineDriver, makeGameEngineOptions, makeRuntime, makeUpdateRuntime$ } from '@ogod/game-engine-driver';
import { gameRun } from '@ogod/game-run';
import gsap from 'gsap';
import { concat, concatMap, distinctUntilChanged, EMPTY, filter, first, map, merge, of, switchMap, tap } from "rxjs";
import { makeFeatureBackgroundColors, makeFeatureBackgroundUpdate } from './app/background/make';
import { makeFeatureCamera$ } from './app/camera/make';
import { makeFeatureFps } from './app/fps';
import { makeRender$ } from './app/render';
import { makeIntroScene } from './app/scenes/intro';
import { makePlayScene } from './app/scenes/play';
import { makeSplashScene } from './app/scenes/splash';
import { makeSceneStart } from './app/scenes/start';
import { AppAction, AppReflectState, AppState, WorkerSources } from './app/state';

declare var self: DedicatedWorkerGlobalScope;

function main(sources: WorkerSources) {
    gsap.ticker.remove(gsap.updateRoot);
    sources.GameEngine.frame$.subscribe(({ elapsed }) => gsap.updateRoot(elapsed / 1000));
    const state = {
        gmap: {
            platforms: {},
            width: 50,
            height: 5,
            gravity: -10,
            scale: 10,
            mapScale: 100
        },
        fps: 0
    } as AppState;
    return {
        GameEngine: {
            feature$: merge(
                makeFeature$(merge(
                    makeFeatureCamera$(sources),
                    of(makeFeatureObservable('gmap', makeFeature$(of(makeFeatureObservable('gravity', sources.GameEngine.actions.gravity)), state.gmap))),
                    of(makeFeatureFps(sources.GameEngine)),
                    of(makeFeatureBackgroundColors(sources)),
                    of(makeFeatureBackgroundUpdate(sources))
                ), state),
                makeFeature$(concat(
                    of(makeSplashScene(sources)),
                    of(makeIntroScene(sources)),
                    of(makeSceneStart(sources)),
                    of(makePlayScene(sources))
                ), state, concatMap)
            ),
            reflect$: of(makeRuntime<ReflectState<AppState, AppReflectState>>(({ fps, loading, loaded, paused, gmap }) =>
                ({ fps, loading, loaded, paused, gravity: gmap.gravity }))),
            render$: makeRender$(sources),
            update$: sources.GameEngine.state$.pipe(
                map((s) => s.paused),
                distinctUntilChanged(),
                switchMap((paused) => paused ? EMPTY : makeUpdateRuntime$(sources.GameEngine))
            )
        },
        World: {
            update$: sources.GameEngine.state$.pipe(
                filter((s) => s.start),
                first(),
                switchMap(() => sources.GameEngine.update$)
            ),
            gravity$: sources.GameEngine.state$.pipe(
                map((s) => s.gmap.gravity),
                distinctUntilChanged(),
                map((g) => ({ x: 0, y: g }))
            )
        }
    }
}

let options = makeGameEngineOptions<AppState, AppAction>(self, ['camera', 'controls', 'start', 'paused', 'gravity', 'background']);
options.dispose = gameRun(main, {
    GameEngine: makeGameEngineDriver(options),
    World: makeGameBox2dDriver({ x: 0, y: -10 })
});
