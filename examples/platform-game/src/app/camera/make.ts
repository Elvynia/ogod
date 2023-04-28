import { makeFeature$ } from "@ogod/game-engine-driver";
import { filter, first, ignoreElements, map, switchMap, tap, withLatestFrom } from "rxjs";
import { AppState, WorkerSources } from "../state";

export function makeFeatureCameraResize(sources: WorkerSources, target: AppState) {
    return makeFeature$({
        key: 'camera',
        value$: sources.GameEngine.action$.getHandler('camera').pipe(
            withLatestFrom(sources.GameEngine.renderTarget$),
            map(([{ width, height }, canvas]) => {
                canvas.width = width;
                canvas.height = height;
                return {
                    ...target.camera,
                    width,
                    height
                };
            })
        ),
        target
    });
}

export function makeFeatureCameraUpdate(sources: WorkerSources, target: AppState) {
    return makeFeature$({
        key: 'camera',
        value$: sources.GameEngine.state$.pipe(
            filter((s) => !!s.shapes?.player),
            first(),
            switchMap(({ shapes, camera, gmap }) => {
                const minY = -gmap.height * gmap.scale / 2;
                const maxX = gmap.width * gmap.scale - camera.width;
                return sources.GameEngine.game$.pipe(
                    tap(() => {
                        // FIXME: Smmoth scrolling by tweening with delta.
                        camera.x = Math.min(maxX, Math.max(0, shapes.player.x - camera.width / 2));
                        camera.y = Math.min(-minY, Math.max(minY, shapes.player.y - camera.height / 2));
                    }),
                    ignoreElements()
                )
            })
        ),
        target
    })
}
