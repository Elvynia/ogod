import { makeFeature$ } from '@ogod/game-engine-driver';
import { AppState, WorkerSources } from '../state';

export function makeFeatureMapGravity(sources: WorkerSources, target: AppState) {
    return makeFeature$({
        key: 'gmap',
        value$: makeFeature$({
            key: 'gravity',
            value$: sources.GameEngine.actions.gravity,
            target: target.gmap
        }),
        target
    })
}
