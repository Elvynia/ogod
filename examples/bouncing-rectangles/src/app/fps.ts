import { GameEngineSource, RenderState } from '@ogod/game-engine-driver';
import { makeFeature$ } from '@ogod/game-engine-driver';
import { bufferCount, distinctUntilChanged, map } from 'rxjs';
import { AppState } from './state';

export function makeFeatureFps(engine: GameEngineSource, target: AppState) {
    return makeFeature$({
        key: 'fps',
        value$: engine.game$.pipe(
            bufferCount(10),
            map((frames: RenderState[]) => {
                const total = frames.reduce((acc, curr) => {
                    // FIXME: handle UpdateState types in RenderState.
                    acc += curr[0] as any as number;
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
