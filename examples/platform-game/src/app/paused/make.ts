import { FeatureKey } from '@ogod/driver-engine';
import { map, withLatestFrom } from 'rxjs';
import { AppState, WorkerSources } from '../state';

export function makeFeaturePaused(sources: WorkerSources): FeatureKey<AppState, 'paused'> {
    return {
        key: 'paused',
        publishOnCreate: true,
        publishOnNext: true,
        value$: sources.Engine.action$.getHandler('paused').pipe(
            withLatestFrom(sources.Engine.state$.pipe(
                map((s) => s.paused)
            )),
            map(([_, paused]) => !paused)
        ),
        value: false
    };
}
