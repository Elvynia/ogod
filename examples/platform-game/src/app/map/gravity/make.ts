import { FeatureKey } from '@ogod/game-engine-driver';
import { WorkerSources } from '../../state';
import { MapState } from '../state';

export function makeFeatureMapGravity(sources: WorkerSources): FeatureKey<MapState, 'gravity'> {
    return {
        key: 'gravity',
        publishOnCreate: true,
        value$: sources.GameEngine.action$.getHandler('gravity'),
        value: -10
    }
}
