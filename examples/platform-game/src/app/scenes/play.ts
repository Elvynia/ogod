import { concat, first, ignoreElements, switchMap, tap } from 'rxjs';
import { makeFeatureFps } from '../fps';
import { makeShapes$ } from '../shape/make';
import { WorkerSources } from '../state';

export function makePlayScene(sources: WorkerSources) {
    return {
        camera$: concat(
            sources.GameEngine.action$.camera.pipe(
                first()
            ),
            sources.GameEngine.state$.pipe(
                switchMap(({ camera, shapes }) => sources.GameEngine.update$.pipe(
                    tap((delta) => {
                        camera.x = shapes.player.x - camera.width / 2;
                        camera.y = shapes.player.y - camera.height / 2
                    }),
                    ignoreElements()
                ))
            )
        ),
        controls$: sources.GameEngine.action$.controls.asObservable(),
        fps$: makeFeatureFps(sources.GameEngine),
        shapes$: makeShapes$(sources)
    }
}
