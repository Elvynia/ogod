import { makeGameBox2dDriver } from '@ogod/game-box2d-driver';
import { makeDriverGameEngine, makeFeatureObject$, makeGame$, makeReflect$, makeUpdate$ } from '@ogod/game-engine-driver';
import { gameRun } from '@ogod/game-run';
import gsap from 'gsap';
import { ActionSubjectDefault } from 'packages/game-engine-driver/src/lib/action/state';
import { EMPTY, distinctUntilChanged, first, map, merge, of, share, switchMap } from "rxjs";
import { makeFeatureBackground } from './app/background/make';
import { makeFeatureCameraResize } from './app/camera/make';
import { makeFeatureControls } from './app/controls/make';
import { makeFeatureFps } from './app/fps/make';
import { makeFeatureLoading } from './app/loading/make';
import { makeFeatureMapInit } from './app/map/make';
import { makeFeaturePhase } from './app/phase/make';
import { PHASE } from './app/phase/state';
import { makeRenderer$ } from './app/render';
import { makeSceneLevel$ } from './app/level/make';
import { makeFeatureSplash } from './app/splash/make';
import { ActionHandlers, AppState, WorkerSinks, WorkerSources } from './app/state';

declare var self: DedicatedWorkerGlobalScope;

function main(sources: WorkerSources): WorkerSinks {
    gsap.ticker.remove(gsap.updateRoot);
    sources.GameEngine.game$.subscribe(([{ elapsed }]) => gsap.updateRoot(elapsed / 1000));
    const update$ = makeUpdate$().pipe(
        share()
    );
    const pausableUpdate$ = sources.GameEngine.state$.pipe(
        map((s) => s.paused),
        distinctUntilChanged(),
        switchMap((paused) => paused ?
            sources.GameEngine.action$.getHandler('background').pipe(
                switchMap(() => update$.pipe(
                    first()
                ))
            ) : update$)
    );
    // sources.GameEngine.state$.subscribe((s) => console.log('STATE- key after: ' + s.phase));
    // sources.GameEngine.game$.subscribe(([_, s]) => console.log('DEBUG GAME PHASE: ', s.phase));
    return {
        GameEngine: {
            game$: makeGame$({
                state$: sources.GameEngine.state$,
                update$: pausableUpdate$
            }),
            reflect$: makeReflect$({
                state$: sources.GameEngine.state$,
                buffer$: update$,
                transform: ({ fps, loading, paused, map, phase, background }) =>
                    ({ fps, loading, paused, gravity: map.gravity, level: map.level, phase, baseColor: background.baseColor })
            }),
            renderer$: makeRenderer$(sources),
            state$: merge(
                makeFeatureObject$({
                    key$: of(
                        makeFeatureBackground(sources),
                        makeFeatureCameraResize(sources),
                        makeFeatureControls(sources),
                        makeFeatureFps(sources),
                        makeFeatureLoading(sources),
                        makeFeatureMapInit(sources),
                        makeFeaturePhase(sources),
                        makeFeatureSplash(sources)
                    ),
                    state$: of({} as AppState)
                }),
                makeSceneLevel$(sources)
            )
        },
        World: {
            update$: sources.GameEngine.state$.pipe(
                map((s) => s.phase),
                distinctUntilChanged(),
                switchMap((phase) => phase === PHASE.PLAY ? pausableUpdate$.pipe(map(({ delta }) => delta)) : EMPTY)
            ),
            gravity$: sources.GameEngine.state$.pipe(
                map((s) => s.map.gravity),
                distinctUntilChanged(),
                map((g) => ({ x: 0, y: g }))
            )
        }
    }
}

gameRun(main, {
    GameEngine: makeDriverGameEngine({
        action$: new ActionSubjectDefault(new ActionHandlers()),
        workerContext: self
    }),
    World: makeGameBox2dDriver({ x: 0, y: -10 })
}, self);
