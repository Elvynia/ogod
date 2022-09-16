import { makeFeature$ } from '@ogod/game-engine-driver';
import { concat, filter, first, map, mergeMap, of, range, switchMap } from 'rxjs';
import { PHASE } from '../phase/state';
import { makeSleetBounce$ } from '../sleet/make';
import { AppState, WorkerSources } from '../state';

export function makeFeatureSplash(sources: WorkerSources, target: AppState) {
    return concat(
        makeFeature$({
            key: 'phase',
            value$: sources.GameEngine.state$.pipe(
                filter((s) => !!s.camera?.width),
                first(),
                map(() => PHASE.SPLASH)
            ),
            target
        }),
        makeFeature$({
            key: 'splash',
            value$: sources.GameEngine.state$.pipe(
                filter((s) => s.phase === PHASE.SPLASH),
                first(),
                switchMap((state: AppState) => {
                    const sleetBounce$ = makeSleetBounce$(state);
                    return range(1, state.camera.width / 100 - 1).pipe(
                        mergeMap((x) => range(1, state.camera.height / 100 - 1).pipe(
                            mergeMap((y) => sleetBounce$(x * 100, y * 100))
                        ))
                    )
                })
            ),
            target,
            remove: true
        }),
        makeFeature$({
            key: 'phase',
            value$: of(PHASE.START),
            target
        }),
    )
}
