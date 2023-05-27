import { FeatureKey } from '@ogod/game-engine-driver';
import { map, withLatestFrom } from 'rxjs';
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
            map(([_, paused]) => !paused)
        ),
        value: false
    };
}
