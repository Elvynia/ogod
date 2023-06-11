import { FeatureKey, makeStateObject } from '@ogod/driver-engine';
import { first, map, of } from 'rxjs';
import { AppState, WorkerSources } from '../state';
import { makeFeatureMapGravity } from './gravity/make';
import { makeFeatureMapPlatform } from './platform/make';

export function makeFeatureMapInit(sources: WorkerSources): FeatureKey<AppState, 'map'> {
    return {
        key: 'map',
        value$: makeStateObject({
            key$: of(
                makeFeatureMapGravity(sources)
            ),
            publishOnCreate: true,
            state: {
                platforms: undefined,
                width: 20,
                height: 5,
                gravity: -10,
                scale: 100,
                level: 1
            }
        })
    }
}

export function makeFeatureMapLoad(sources: WorkerSources): FeatureKey<AppState, 'map'> {
    return {
        key: 'map',
        publishOnNext: true,
        value$: makeStateObject({
            key$: of(
                makeFeatureMapPlatform(sources)
            ),
            state: sources.Engine.state$.pipe(
                map((s) => s.map),
                first()
            )
        })
    }
}
