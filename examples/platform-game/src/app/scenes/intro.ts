import { RuntimeState } from '@ogod/game-core';
import { EMPTY, map } from 'rxjs';
import { makeFeatureFps } from '../fps';
import { makeGenerateMap$ } from '../map/make';
import { AppState, WorkerSources } from '../state';

export function makeIntroScene(sources: WorkerSources): RuntimeState<Pick<AppState, 'fps' | 'loading' | 'gameMap'>> {
    const gameMap = {
        platforms: {},
        width: 100,
        height: 10,
        scale: 10
    };
    return {
        gameMap,
        loading$: makeGenerateMap$(gameMap.width, gameMap.height).pipe(
            map((l) => ({ ['map']: l }))
        ),
        fps$: makeFeatureFps(sources.GameEngine)
    }
}
