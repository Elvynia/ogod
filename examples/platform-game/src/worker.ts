import { distinctState } from '@ogod/core';
import { makeDriverBox2d } from '@ogod/driver-box2d';
import { ActionSubjectDefault, makeDriverEngine, makeStateObject } from '@ogod/driver-engine';
import { makeFeatureFps } from '@ogod/examples-common';
import { run } from '@ogod/run';
import { EMPTY, distinctUntilChanged, filter, first, map, merge, of, switchMap } from "rxjs";
import { makeFeatureBackground } from './app/background/make';
import { makeFeatureCamera } from './app/camera/make';
import { makeFeatureControls } from './app/controls/make';
import { makeLevel } from './app/level/make';
import { makeFeatureLoading } from './app/loading/make';
import { makeFeatureMapInit } from './app/map/make';
import { makeFeaturePhase } from './app/phase/make';
import { PHASE } from './app/phase/state';
import { makeRenderer$ } from './app/render';
import { makeFeatureSplash } from './app/splash';
import { ActionHandlers, AppState, WorkerSinks, WorkerSources } from './app/state';

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
                        makeFeatureFps({
                            key: 'fps',
                            engine$: sources.Engine.engine$
                        }),
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
                            shape.worldX = Math.round(shape.body.GetPosition().x * sources.World.scale);
                            shape.worldY = Math.round(shape.body.GetPosition().y * sources.World.scale);
                            shape.x = shape.worldX - state.camera.x;
                            shape.y = state.camera.height - shape.worldY + state.camera.y;
                        }
                        for (let id in state.map.platforms) {
                            const p = state.map.platforms[id];
                            p.x = p.worldX - state.camera.x;
                            p.y = state.camera.height - p.worldY + state.camera.y;
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
                            if (phase === PHASE.LOAD || phase === PHASE.PLAY) {
                                const minY = -camera.height / 2;
                                const maxY = mapState.height * mapState.scale + minY;
                                const maxX = mapState.width * mapState.scale - camera.width;
                                return [() => {
                                    // FIXME: Smmoth scrolling by tweening with delta.
                                    camera.x = Math.min(maxX, Math.max(0, shapes.player.worldX - camera.width / 2));
                                    camera.y = Math.min(maxY, Math.max(minY, shapes.player.worldY - camera.height / 2));
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
    World: makeDriverBox2d({ x: 0, y: -10 })
}, self);
