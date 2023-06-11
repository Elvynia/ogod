import { makeDriverBox2d } from '@ogod/driver-box2d';
import { makeActionEngineListener, makeDriverEngine, makeStateObject } from '@ogod/driver-engine';
import { run } from '@ogod/run';
import { ActionSubjectDefault } from 'packages/driver-engine/src/lib/action/state';
import { EMPTY, distinctUntilChanged, filter, first, map, merge, of, switchMap } from "rxjs";
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
                )
            }
        },
        World: {
            update$: sources.Engine.state$.pipe(
                map((s) => s.phase),
                distinctUntilChanged(),
                switchMap((phase) => phase === PHASE.PLAY ? pausableUpdate$.pipe(map(({ delta }) => delta)) : EMPTY)
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
        listeners: [makeActionEngineListener('camera')],
        workerContext: self
    }),
    World: makeDriverBox2d({ x: 0, y: -10 }, WORLD_SCALE)
}, self);
