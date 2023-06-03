import { FeatureKey } from '@ogod/driver-engine';
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
