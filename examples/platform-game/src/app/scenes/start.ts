import { makeFeature$ } from '@ogod/game-engine-driver';
import { delayWhen, first, merge, of } from 'rxjs';
import { AppState, WorkerSources } from '../state';

export function makeSceneStart(sources: WorkerSources, target: AppState) {
    return merge(
        makeFeature$({
            key: 'initialized',
            value$: of(true).pipe(
                delayWhen(() => sources.GameEngine.update$.pipe(
                    first()
                ))
            ),
            target
        }),
        makeFeature$({
            key: 'start',
            value$: sources.GameEngine.actions.start.pipe(
                first()
            ),
            target
        })
    )
}
