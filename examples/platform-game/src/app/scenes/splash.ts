import { makeFeature$ } from '@ogod/game-engine-driver';
import { filter, first, mergeMap, range, switchMap } from 'rxjs';
import { makeSleetBounce$ } from '../sleet/make';
import { AppState, WorkerSources } from '../state';

export function makeSceneSplash(sources: WorkerSources, target: AppState) {
    return makeFeature$({
        key: 'splash',
        value$: sources.GameEngine.state$.pipe(
            filter((s) => !!s.camera),
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
    });
}
