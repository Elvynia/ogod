import { FeatureKey, makeStateObject } from '@ogod/driver-engine';
import { first, map, of, skip, switchMap } from 'rxjs';
import { AppState, WorkerSources } from '../state';
import { makeFeatureMapGravity } from './gravity/make';
import { makeFeatureMapPlatform } from './platform/make';

export function makeFeatureMapInit(sources: WorkerSources): FeatureKey<AppState, 'map'> {
    return {
        key: 'map',
        value$: sources.Engine.target$.pipe(
            skip(1),
            first(),
            switchMap((canvas) => makeStateObject({
                key$: of(
                    makeFeatureMapGravity(sources)
                ),
                publishOnCreate: true,
                state: {
                    platforms: undefined,
                    platformWidth: undefined,
                    width: canvas.width,
                    height: canvas.height,
                    gravity: -10,
                    scale: 300,
                    level: 1,
                    size: 5
                }
            }))
        )
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
