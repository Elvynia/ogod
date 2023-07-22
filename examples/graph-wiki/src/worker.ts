import { isActionEngineResize } from "@ogod/core";
import { ActionSubjectDefault, FeatureKey, makeDriverEngine, makeStateObject } from "@ogod/driver-engine";
import { run } from "@ogod/run";
import { filter, first, map, of, startWith, withLatestFrom } from "rxjs";
import { BoxGeometry, Color, DirectionalLight, Mesh, MeshLambertMaterial, PerspectiveCamera, Raycaster, Scene, WebGLRenderer } from "three";
import { ActionHandlers, AppState, WorkerSinks, WorkerSources } from "./app/state";

declare var self: DedicatedWorkerGlobalScope;
function makeFeatureCamera(sources: WorkerSources): FeatureKey<AppState, 'camera'> {
    return {
        key: 'camera',
        publishOnNext: true,
        value$: sources.Engine.target$.pipe(
            first(),
            map((canvas) => {
                const camera = new PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 100);
                camera.position.z = 5;
                return camera;
            })
        )
    }
}
export function makeRender(sources: WorkerSources) {
    return sources.Engine.state$.pipe(
        withLatestFrom(sources.Engine.target$),
        first(),
        map(([state, canvas]) => {
            const renderer = new WebGLRenderer({
                antialias: true,
                canvas
            });
            renderer.useLegacyLights = false;
            sources.Engine.action$.getHandler('engine').pipe(
                filter(isActionEngineResize),
                map(({ payload }) => payload),
                startWith(canvas)
            ).subscribe((c) => {
                state.camera.aspect = c.width / c.height;
                state.camera.updateProjectionMatrix();
                renderer.setSize(c.width, c.height, false);
            });
            return [() => renderer.render(state.scene, state.camera)];
        })
    )
}

function main(sources: WorkerSources): WorkerSinks {
    const scene = new Scene();
    scene.background = new Color('#cdcdcd');
    const light = new DirectionalLight(0xffffff, 3);
    light.position.set(1, 1, 1).normalize();
    scene.add(light);
    const cube = new Mesh(new BoxGeometry(), new MeshLambertMaterial({ color: '#ff33ff' }));
    // cube.position.z = -5;
    scene.add(cube);
    return {
        Engine: {
            render$: makeRender(sources),
            state$: makeStateObject({
                publishOnCreate: true,
                key$: of(
                    makeFeatureCamera(sources)
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
            })
        }
    }
}

run(main, {
    Engine: makeDriverEngine({
        action$: new ActionSubjectDefault(new ActionHandlers()),
        workerContext: self
    })
}, self);
