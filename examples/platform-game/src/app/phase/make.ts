import { FeatureKey } from '@ogod/driver-engine';
import { filter, first, map, merge, tap } from 'rxjs';
import { AppState, WorkerSources } from '../state';
import { PHASE } from './state';

export function makeFeaturePhase(sources: WorkerSources): FeatureKey<AppState, 'phase'> {
    return {
        key: 'phase',
        publishOnCreate: true,
        publishOnNext: true,
        value$: merge(
            sources.Engine.action$.getHandler('phase'),
            sources.Engine.state$.pipe(
                filter((s) => !!s.camera?.width),
                first(),
                map(() => PHASE.SPLASH)
            )
        ),
        value: PHASE.NONE
    };
}
