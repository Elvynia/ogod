import { EngineSubject, FeatureKey } from '@ogod/driver-engine';
import { bufferCount, distinctUntilChanged, map } from 'rxjs';

export function makeFeatureFps<K extends string>(params: {
    key: K,
    engine$: EngineSubject,
}): FeatureKey<Record<K, number>, K> {
    return {
        key: params.key,
        publishOnCreate: true,
        publishOnNext: true,
        value$: params.engine$.pipe(
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
