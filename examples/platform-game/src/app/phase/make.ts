import { makeFeature$ } from '@ogod/game-engine-driver';
import { AppState, WorkerSources } from '../state';

export function makeFeaturePhase(sources: WorkerSources, target: AppState) {
    return makeFeature$({
        key: 'phase',
        value$: sources.GameEngine.action$.handlers.phase,
        target
    });
}
