import { FeatureKey } from '@ogod/driver-engine';
import { filter, first, mergeMap, range, switchMap, tap } from 'rxjs';
import { PHASE } from '../phase/state';
import { AppState, WorkerSources } from '../state';
import { makeSleetBounce$ } from './sleet/make';

export function makeFeatureSplash(sources: WorkerSources): FeatureKey<AppState, 'splash'> {
    return {
        key: 'splash',
        publishOnComplete: true,
        publishOnCreate: true,
        publishOnNext: true,
        value$: sources.GameEngine.state$.pipe(
            filter((s) => s.splash && s.phase === PHASE.SPLASH),
            first(),
            switchMap((state) => {
                const sleetBounce$ = makeSleetBounce$(state);
                return range(1, state.camera.width / 100 - 1).pipe(
                    mergeMap((x) => range(1, state.camera.height / 100 - 1).pipe(
                        mergeMap((y) => sleetBounce$(x * 100, y * 100))
                    )),
                    tap({
                        complete: () => sources.GameEngine.action$.getHandler('phase').next(PHASE.START)
                    })
                )
            })
        ),
        value: {}
    };
}
