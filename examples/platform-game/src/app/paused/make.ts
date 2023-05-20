import { FeatureKey } from '@ogod/game-engine-driver';
import { filter, first, map, takeUntil, withLatestFrom } from 'rxjs';
import { PHASE } from '../phase/state';
import { AppState, WorkerSources } from '../state';

export function makeFeaturePaused(sources: WorkerSources): FeatureKey<AppState, 'paused'> {
    return {
        key: 'paused',
        publishOnCreate: true,
        publishOnNext: true,
        value$: sources.GameEngine.action$.getHandler('paused').pipe(
            withLatestFrom(sources.GameEngine.state$.pipe(
                map((s) => s.paused)
            )),
            map(([_, paused]) => !paused),
            takeUntil(sources.GameEngine.state$.pipe(
                filter((s) => s.phase !== PHASE.PLAY),
                first()
            ))
        ),
        value: false
    };
}
