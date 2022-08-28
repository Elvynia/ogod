import { RuntimeState } from '@ogod/game-core';
import { last, map, takeUntil } from 'rxjs';
import { makeFeatureFps } from '../fps';
import { makeGenerateMap$ } from '../map/make';
import { AppState, WorkerSources } from '../state';

export function makeIntroScene(sources: WorkerSources): RuntimeState<Partial<AppState>> {
    const gameMap = {
        platforms: {},
        width: 10,
        height: 10,
        scale: 10
    };
    const loading$ = makeGenerateMap$(gameMap.width, gameMap.height).pipe(
        map((l) => ({ ['map']: l }))
    );
    return {
        gameMap,
        loading$,
        fps$: makeFeatureFps(sources.GameEngine).pipe(
            takeUntil(loading$.pipe(
                last()
            ))
        )
    }
}
