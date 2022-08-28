import { Feature } from '@ogod/game-core';
import { makeFeatureObservable } from '@ogod/game-engine-driver';
import { filter, first, ignoreElements, map, merge, Observable, switchMap, tap } from 'rxjs';
import { Camera } from '../camera/state';
import { makeShapes$ } from '../shape/make';
import { WorkerSources } from '../state';

export function makePlayScene$(sources: WorkerSources): Observable<Feature[]> {
    return sources.GameEngine.action$.camera.pipe(
        first(),
        map((camera: Camera) => {
            camera.x = 0;
            camera.y = 0;
            return [
                makeFeatureObservable('camera', merge(
                    sources.GameEngine.action$.camera.pipe(
                        map(({ width, height }) => {
                            sources.GameEngine.canvas.width = width;
                            sources.GameEngine.canvas.height = height;
                            camera.width = width;
                            camera.height = height;
                            return camera;
                        })
                    ),
                    sources.GameEngine.state$.pipe(
                        filter((s) => s.shapes?.player),
                        first(),
                        switchMap(({ shapes }) => sources.GameEngine.update$.pipe(
                            tap((delta) => {
                                camera.x = shapes.player.x - camera.width / 2;
                                camera.y = shapes.player.y - camera.height / 2;
                            }),
                            ignoreElements()
                        ))
                    )
                ), camera),
                makeFeatureObservable('controls', sources.GameEngine.action$.controls, {}),
                makeFeatureObservable('shapes', makeShapes$(sources))
            ];
        })
    )
}
