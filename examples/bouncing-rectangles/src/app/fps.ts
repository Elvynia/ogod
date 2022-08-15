import { GameEngineSource } from '@ogod/game-engine-driver';
import { bufferCount, map } from 'rxjs';

export function makeFeatureFps(sources: { GameEngine: GameEngineSource<any> }) {
    return sources.GameEngine.frame$.pipe(
        bufferCount(10),
        map((frames: number[]) => {
            const total = frames.reduce((acc, curr) => {
                acc += curr;
                return acc;
            }, 0);

            return 1 / (total / frames.length);
        })
    );
}
