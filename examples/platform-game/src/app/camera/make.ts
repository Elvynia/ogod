import { makeFeature$ } from "@ogod/game-engine-driver";
import { filter, first, ignoreElements, map, merge, startWith, switchMap, tap } from "rxjs";
import { AppState, WorkerSources } from "../state";

export function makeFeatureCamera$(sources: WorkerSources, target: AppState) {
    return sources.GameEngine.actions.camera.pipe(
        first(),
        switchMap((camera) => {
            camera.x = 0;
            camera.y = 0;
            return makeFeature$({
                key: 'camera',
                value$: merge(
                    sources.GameEngine.actions.camera.pipe(
                        map(({ width, height }) => {
                            sources.GameEngine.canvas.width = width;
                            sources.GameEngine.canvas.height = height;
                            camera.width = width;
                            camera.height = height;
                            return camera;
                        })
                    ),
                    sources.GameEngine.state$.pipe(
                        filter((s) => !!s.shapes?.player),
                        first(),
                        switchMap(({ shapes, camera, gmap }) => {
                            const minY = -gmap.height * gmap.mapScale / 2;
                            const maxX = gmap.width * gmap.mapScale - camera.width;
                            return sources.GameEngine.update$.pipe(
                                tap((delta) => {
                                    camera.x = Math.min(maxX, Math.max(0, shapes.player.x - camera.width / 2));
                                    camera.y = Math.min(-minY, Math.max(minY, shapes.player.y - camera.height / 2));
                                }),
                                ignoreElements()
                            )
                        })
                    )
                ).pipe(
                    startWith(camera)
                ),
                target
            })
        })
    );
}
