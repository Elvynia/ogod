import { isActionEngineResize } from "@ogod/core";
import { filter, first, map, startWith, withLatestFrom } from "rxjs";
import { WebGLRenderer } from 'three';
import { WorkerSources } from "./state";

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
