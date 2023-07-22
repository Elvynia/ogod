import { ActionSubjectDefault, makeDriverEngine, makeStateObject } from "@ogod/driver-engine";
import { makeFeatureSwitch } from "@ogod/examples-common";
import { run } from "@ogod/run";
import { distinctUntilChanged, filter, first, map, of, switchMap, withLatestFrom } from "rxjs";
import { Color, DirectionalLight, Raycaster, Scene } from "three";
import { makeFeatureCamera, makeUpdateCamera } from "./app/camera/make";
import { makeFeatureCubes } from "./app/cubes/make";
import { makeFeaturePointer } from "./app/pointer/make";
import { makeRender } from "./app/render";
import { makeFeatureSelected } from "./app/selected/make";
import { ActionHandlers, WorkerSinks, WorkerSources } from "./app/state";

declare var self: DedicatedWorkerGlobalScope;


function main(sources: WorkerSources): WorkerSinks {
    const scene = new Scene();
    scene.background = new Color('#cdcdcd');
    const light = new DirectionalLight(0xffffff, 3);
    light.position.set(1, 1, 1).normalize();
    scene.add(light);
    return {
        Engine: {
            reflect$: sources.Engine.target$.pipe(
                first(),
                switchMap((canvas) => sources.Engine.engine$.reflect$.pipe(
                    withLatestFrom(sources.Engine.state$),
                    map(([_, state]) => {
                        if (state.selected) {
                            return {
                                name: state.selected.name,
                                position: {
                                    x: canvas.width / 2 + state.pointer.x * canvas.width / 2,
                                    y: canvas.height / 2 -state.pointer.y * canvas.height / 2
                                }
                            }
                        }
                        return {};
                    })
                ))
            ),
            render$: makeRender(sources),
            state$: makeStateObject({
                publishOnCreate: true,
                key$: of(
                    makeFeatureCamera(sources),
                    makeFeatureCubes(sources),
                    makeFeaturePointer(sources),
                    makeFeatureSwitch({
                        key: 'paused',
                        state$: sources.Engine.state$,
                        action$: sources.Engine.action$.getHandler('paused')
                    }),
                    makeFeatureSelected(sources) as any // FIXME: change FeatureKey generics.
                ),
                state: {
                    camera: undefined,
                    cubes: undefined,
                    paused: false,
                    pointer: undefined,
                    radius: 5,
                    raycaster: new Raycaster(),
                    selectColor: '#FF7F11',
                    scene,
                    theta: 0
                }
            }),
            systems: {
                pre$: sources.Engine.state$.pipe(
                    filter((state) => !!state.camera),
                    first(),
                    switchMap((state) => sources.Engine.state$.pipe(
                        map((s) => s.paused),
                        distinctUntilChanged(),
                        map((paused) => paused ? [] : makeUpdateCamera(state))
                    ))
                )
            }
        }
    }
}

run(main, {
    Engine: makeDriverEngine({
        action$: new ActionSubjectDefault(new ActionHandlers()),
        workerContext: self
    })
}, self);
