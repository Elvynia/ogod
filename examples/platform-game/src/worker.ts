import { makeGameBox2dDriver } from '@ogod/game-box2d-driver';
import { Renderer, makeDriverGameEngine, makeGame$, makeReflect$, makeUpdate$ } from '@ogod/game-engine-driver';
import { gameRun } from '@ogod/game-run';
import gsap from 'gsap';
import { ActionSubjectDefault } from 'packages/game-engine-driver/src/lib/action/state';
import { EMPTY, Observable, concat, distinctUntilChanged, first, map, merge, share, switchMap } from "rxjs";
import { makeFeatureBackgroundColors, makeFeatureBackgroundUpdate } from './app/background/make';
import { makeFeatureCameraResize } from './app/camera/make';
import { makeFeatureFps } from './app/fps';
import { makeFeatureMapGravity } from './app/gravity/make';
import { makeFeatureSceneLevel } from './app/level/make';
import { makeFeaturePhase } from './app/phase/make';
import { PHASE } from './app/phase/state';
import { makeRenderer$ } from './app/render';
import { makeFeatureSplash as makeFeatureSceneSplash } from './app/splash/make';
import { ActionKeys, AppState, WorkerSinks, WorkerSources } from './app/state';

declare var self: DedicatedWorkerGlobalScope;

function main(sources: WorkerSources): WorkerSinks {
    gsap.ticker.remove(gsap.updateRoot);
    sources.GameEngine.game$.subscribe(([{ elapsed }]) => gsap.updateRoot(elapsed / 1000));
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
    const update$ = makeUpdate$().pipe(
        share()
    );
    const pausableUpdate$ = sources.GameEngine.state$.pipe(
        map((s) => s.paused),
        distinctUntilChanged(),
        switchMap((paused) => paused ?
            sources.GameEngine.action$.handlers.background.pipe(
                switchMap(() => update$.pipe(
                    first()
                ))
            ) : update$)
    );
    return {
        GameEngine: {
            game$: makeGame$({
                state$: sources.GameEngine.state$,
                update$: pausableUpdate$
            }),
            reflect$: makeReflect$({
                state$: sources.GameEngine.state$,
                buffer$: update$,
                transform: ({ fps, loading, paused, gmap, phase, background }) =>
                    ({ fps, loading, paused, gravity: gmap.gravity, level: gmap.level, phase, baseColor: background.baseColor })
            }),
            renderer$: makeRenderer$(sources) as any as Observable<Renderer[]>,
            state$: merge(
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
            )
        },
        World: {
            update$: sources.GameEngine.state$.pipe(
                map((s) => s.phase),
                distinctUntilChanged(),
                switchMap((phase) => phase === PHASE.PLAY ? pausableUpdate$.pipe(map(({ delta }) => delta)) : EMPTY)
            ),
            gravity$: sources.GameEngine.state$.pipe(
                map((s) => s.gmap.gravity),
                distinctUntilChanged(),
                map((g) => ({ x: 0, y: g }))
            )
        }
    }
}

self.close = gameRun(main, {
    GameEngine: makeDriverGameEngine({
        action$: new ActionSubjectDefault({ keys: ActionKeys }),
        workerContext: self
    }),
    World: makeGameBox2dDriver({ x: 0, y: -10 })
});
