import { distinctState } from '@ogod/core';
import { makeDriverBox2d } from '@ogod/driver-box2d';
import { ActionSubjectDefault, makeDriverEngine, makeStateObject } from '@ogod/driver-engine';
import { run } from '@ogod/run';
import { EMPTY, distinctUntilChanged, filter, first, map, merge, of, switchMap } from "rxjs";
import { makeFeatureBackground } from './app/background/make';
import { makeFeatureCamera } from './app/camera/make';
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
    const pausableUpdate$ = sources.Engine.state$.pipe(
        map((s) => s.paused),
        distinctUntilChanged(),
        switchMap((paused) => paused ? EMPTY : sources.Engine.engine$)
    );
    return {
        Engine: {
            reflect$: sources.Engine.state$.pipe(
                first(),
                switchMap((state) => sources.Engine.engine$.reflect$.pipe(
                    map(() => reflectState(state))
                ))
            ),
            render$: makeRenderer$(sources),
            state$: merge(
                makeStateObject({
                    key$: of(
                        makeFeatureBackground(sources),
                        makeFeatureCamera(sources),
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
            systems: {
                pre$: sources.Engine.state$.pipe(
                    filter((s) => !!s.shapes),
                    first(),
                    map((state) => [() => {
                        for (let id in state.shapes) {
                            const shape = state.shapes[id];
                            shape.x = Math.round(shape.body.GetPosition().x * sources.World.scale);
                            shape.y = Math.round(shape.body.GetPosition().y * sources.World.scale);
                        }
                    }])
                ),
                post$: sources.Engine.state$.pipe(
                    filter((s) => s.phase > PHASE.SPLASH),
                    switchMap(() => sources.Engine.state$.pipe(
                        distinctState({
                            resolver: (s) => s.phase + s.camera.width
                        }),
                        map(({ camera, map: mapState, shapes, phase }) => {
                            if (phase === PHASE.PLAY) {
                                const minY = -mapState.height * mapState.scale / 2;
                                const maxX = mapState.width * mapState.scale - camera.width;
                                return [() => {
                                    // FIXME: Smmoth scrolling by tweening with delta.
                                    camera.x = Math.min(maxX, Math.max(0, shapes.player.x - camera.width / 2));
                                    camera.y = Math.min(-minY, Math.max(minY, shapes.player.y - camera.height / 2));
                                }];
                            }
                            return [];
                        })
                    ))
                )
            }
        },
        World: {
            update$: sources.Engine.state$.pipe(
                map((s) => s.phase),
                distinctUntilChanged(),
                switchMap((phase) => phase === PHASE.PLAY ? pausableUpdate$ : EMPTY)
            ),
            gravity$: sources.Engine.state$.pipe(
                map((s) => s.map.gravity),
                distinctUntilChanged(),
                map((g) => ({ x: 0, y: g }))
            )
        }
    }
}

run(main, {
    Engine: makeDriverEngine({
        action$: new ActionSubjectDefault(new ActionHandlers()),
        workerContext: self
    }),
    World: makeDriverBox2d({ x: 0, y: -10 }, WORLD_SCALE)
}, self);
