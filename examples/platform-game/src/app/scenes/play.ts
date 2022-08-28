import { filter } from 'rxjs';
import { RuntimeState } from '@ogod/game-core';
import { concat, first, ignoreElements, of, startWith, switchMap, tap } from 'rxjs';
import { makeFeatureFps } from '../fps';
import { makeShapes$ } from '../shape/make';
import { AppState, WorkerSources } from '../state';

export function makePlayScene(sources: WorkerSources): RuntimeState<AppState> {
    return {
        camera$: concat(
            of(undefined),
            sources.GameEngine.action$.camera.pipe(
                first()
            ),
            sources.GameEngine.state$.pipe(
                filter((state) => !!state.shapes?.player),
                switchMap(({ camera, shapes }) => sources.GameEngine.update$.pipe(
                    tap((delta) => {
                        camera.x = shapes.player.x - camera.width / 2;
                        camera.y = shapes.player.y - camera.height / 2
                    }),
                    ignoreElements()
                ))
            )
        ),
        controls$: sources.GameEngine.action$.controls.asObservable().pipe(
            startWith({})
        ),
        fps$: makeFeatureFps(sources.GameEngine),
        shapes$: makeShapes$(sources)
    }
}
