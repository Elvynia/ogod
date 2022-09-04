import { makeFeatureObservable } from "@ogod/game-engine-driver";
import { filter, first, ignoreElements, map, merge, switchMap, tap } from "rxjs";
import { WorkerSources } from "../state";

export function makeFeatureCamera$(sources: WorkerSources) {
    return sources.GameEngine.actions.camera.pipe(
        first(),
        map((camera) => {
            camera.x = 0;
            camera.y = 0;
            return makeFeatureObservable('camera', merge(
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
                    switchMap(({ shapes, camera }) => sources.GameEngine.update$.pipe(
                        tap((delta) => {
                            camera.x = shapes.player.x - camera.width / 2;
                            camera.y = shapes.player.y - camera.height / 2;
                        }),
                        ignoreElements()
                    ))
                )
            ), camera)
        })
    );
}
