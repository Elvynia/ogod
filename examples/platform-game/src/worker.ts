import { makeGameBox2dDriver } from '@ogod/game-box2d-driver';
import { makeGameEngineDriver, makeGameEngineOptions, makeReflect$, makeUpdate$ } from '@ogod/game-engine-driver';
import { gameRun } from '@ogod/game-run';
import gsap from 'gsap';
import { concat, delay, distinctUntilChanged, EMPTY, first, map, merge, switchMap } from "rxjs";
import { makeFeatureBackgroundColors, makeFeatureBackgroundUpdate } from './app/background/make';
import { makeFeatureCameraResize } from './app/camera/make';
import { makeFeatureFps } from './app/fps';
import { makeFeatureMapGravity } from './app/gravity/make';
import { makeFeatureSceneLevel } from './app/level/make';
import { makeFeaturePhase } from './app/phase/make';
import { PHASE } from './app/phase/state';
import { makeRender$ } from './app/render';
import { makeFeatureSplash as makeFeatureSceneSplash } from './app/splash/make';
import { AppAction, AppState, WorkerSinks, WorkerSources } from './app/state';

declare var self: DedicatedWorkerGlobalScope;

function main(sources: WorkerSources): WorkerSinks {
    gsap.ticker.remove(gsap.updateRoot);
    sources.GameEngine.frame$.subscribe(({ elapsed }) => gsap.updateRoot(elapsed / 1000));
    const state = {
        background: {
            gradients: []
        },
        camera: {
            x: 0,
            y: 0
        },
        gmap: {
            platforms: {},
            width: 20,
            height: 5,
            gravity: -10,
            scale: 100,
            level: 0
        },
        fps: 0,
        phase: -1,
        splash: {}
    } as AppState;
    return {
        GameEngine: {
            feature$: merge(
                makeFeatureFps(sources.GameEngine, state),
                makeFeatureCameraResize(sources, state),
                makeFeatureMapGravity(sources, state),
                makeFeatureBackgroundColors(sources, state),
                makeFeatureBackgroundUpdate(sources, state),
                makeFeaturePhase(sources, state),
                concat(
                    makeFeatureSceneSplash(sources, state),
                    makeFeatureSceneLevel(sources, state)
                )
            ),
            reflect$: makeReflect$(sources.GameEngine).pipe(
                map(({ fps, loading, paused, gmap, phase, background }) =>
                    ({ fps, loading, paused, gravity: gmap.gravity, level: gmap.level, phase, baseColor: background.baseColor }))
            ),
            render$: makeRender$(sources),
            update$: sources.GameEngine.state$.pipe(
                map((s) => s.paused),
                distinctUntilChanged(),
                switchMap((paused) => paused ?
                    sources.GameEngine.actions.background.pipe(
                        switchMap(() => makeUpdate$(sources.GameEngine).pipe(
                            first()
                        ))
                    )
                    : makeUpdate$(sources.GameEngine))
            )
        },
        World: {
            update$: sources.GameEngine.state$.pipe(
                map((s) => s.phase),
                distinctUntilChanged(),
                switchMap((phase) => phase === PHASE.PLAY ? sources.GameEngine.update$ : EMPTY)
            ),
            gravity$: sources.GameEngine.state$.pipe(
                map((s) => s.gmap.gravity),
                distinctUntilChanged(),
                map((g) => ({ x: 0, y: g }))
            )
        }
    }
}

let options = makeGameEngineOptions<AppState, AppAction>(self, ['camera', 'controls', 'phase', 'paused', 'gravity', 'background']);
options.dispose = gameRun(main, {
    GameEngine: makeGameEngineDriver(options),
    World: makeGameBox2dDriver({ x: 0, y: -10 })
});
