import { makeGameBox2dDriver } from '@ogod/game-box2d-driver';
import { makeDriverGameEngine, makeStateObject } from '@ogod/game-engine-driver';
import { gameRun } from '@ogod/game-run';
import gsap from 'gsap';
import { ActionSubjectDefault } from 'packages/game-engine-driver/src/lib/action/state';
import { EMPTY, concat, distinctUntilChanged, filter, first, map, merge, of, switchMap } from "rxjs";
import { makeFeatureBackground } from './app/background/make';
import { makeFeatureCameraResize } from './app/camera/make';
import { makeFeatureControls } from './app/controls/make';
import { makeFeatureFps } from './app/fps/make';
import { makeLevel } from './app/level/make';
import { makeFeatureLoading } from './app/loading/make';
import { makeFeatureMapInit } from './app/map/make';
import { makeFeaturePhase } from './app/phase/make';
import { PHASE } from './app/phase/state';
import { makeRenderer$ } from './app/render';
import { makeFeatureSplash } from './app/splash/make';
import { ActionHandlers, AppState, WorkerSinks, WorkerSources } from './app/state';
import { WORLD_SCALE } from './app/util';

declare var self: DedicatedWorkerGlobalScope;

const reflectState = ({ fps, loading, paused, map, phase, background }) =>
    ({ fps, loading, paused, gravity: map.gravity, level: map.level, phase, baseColor: background.baseColor });

function main(sources: WorkerSources): WorkerSinks {
    gsap.ticker.remove(gsap.updateRoot);
    const pausableUpdate$ = sources.GameEngine.state$.pipe(
        map((s) => s.paused),
        distinctUntilChanged(),
        switchMap((paused) => paused ? EMPTY : sources.GameEngine.engine$)
    );
    return {
        GameEngine: {
            reflect$: sources.GameEngine.state$.pipe(
                first(),
                switchMap((state) => sources.GameEngine.engine$.reflect$.pipe(
                    map(() => reflectState(state))
                ))
            ),
            render$: makeRenderer$(sources),
            state$: merge(
                makeStateObject({
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
                    state: {} as AppState
                }),
                makeLevel(sources)
            ),
            system$: concat(
                of([({ elapsed }) => gsap.updateRoot(elapsed / 1000)]),
                sources.GameEngine.state$.pipe(
                    filter((s) => !!s.shapes),
                    first(),
                    map((state) => [() => {
                        for (let id in state.shapes) {
                            const shape = state.shapes[id];
                            shape.x = Math.round(shape.body.GetPosition().x * sources.World.scale);
                            shape.y = Math.round(shape.body.GetPosition().y * sources.World.scale);
                        }
                    }])
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
    World: makeGameBox2dDriver({ x: 0, y: -10 }, WORLD_SCALE)
}, self);
