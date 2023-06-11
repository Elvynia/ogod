import { FeatureKey } from '@ogod/driver-engine';
import { bufferCount, distinctUntilChanged, map } from 'rxjs';
import { AppState, WorkerSources } from '../state';

export function makeFeatureFps(sources: WorkerSources): FeatureKey<AppState, 'fps'> {
    return {
        key: 'fps',
        publishOnCreate: true,
        publishOnNext: true,
        value$: sources.Engine.engine$.pipe(
            bufferCount(10),
            map((frames) => {
                const total = frames.reduce((acc, curr) => acc + curr.delta, 0) / 1000;
                return 1 / (total / frames.length);
            }),
            map((fps) => Math.round(fps)),
            distinctUntilChanged(),
        ),
        value: 0
    };
}
