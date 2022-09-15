import { GameEngineSource } from '@ogod/game-core';
import { makeFeature$ } from '@ogod/game-engine-driver';
import { bufferCount, distinctUntilChanged, map } from 'rxjs';
import { AppState } from './state';

export function makeFeatureFps(engine: GameEngineSource, target: AppState) {
    return makeFeature$({
        key: 'fps',
        value$: engine.update$.pipe(
            bufferCount(10),
            map((frames: number[]) => {
                const total = frames.reduce((acc, curr) => {
                    acc += curr;
                    return acc;
                }, 0) / 1000;
                return 1 / (total / frames.length);
            }),
            map((fps) => Math.round(fps * 10) / 10),
            distinctUntilChanged(),
        ),
        target
    });
}
