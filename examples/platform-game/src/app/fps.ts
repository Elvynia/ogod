import { GameEngineSource, makeFeature$ } from '@ogod/game-engine-driver';
import { bufferCount, distinctUntilChanged, map } from 'rxjs';
import { AppState } from './state';

export function makeFeatureFps(engine: GameEngineSource, target: AppState) {
    return makeFeature$({
        key: 'fps',
        value$: engine.game$.pipe(
            bufferCount(10),
            map((frames) => {
                const total = frames.reduce((acc, curr) => {
                    acc += curr[0].delta;
                    return acc;
                }, 0) / 1000;
                return 1 / (total / frames.length);
            }),
            map((fps) => Math.round(fps)),
            distinctUntilChanged(),
        ),
        target
    });
}
