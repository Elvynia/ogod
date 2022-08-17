import { GameEngineSource } from '@ogod/game-engine-driver';
import { bufferCount, distinctUntilChanged, map } from 'rxjs';

export function makeFeatureFps(engine: GameEngineSource<any>, buffer: number = 10) {
    return engine.frame$.pipe(
        bufferCount(buffer),
        map((frames: number[]) => {
            const total = frames.reduce((acc, curr) => {
                acc += curr;
                return acc;
            }, 0);
            return 1 / (total / frames.length);
        }),
        map((fps) => Math.round(fps)),
        distinctUntilChanged()
    );
}
