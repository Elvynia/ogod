import { makeFeature$ } from '@ogod/game-engine-driver';
import { map, withLatestFrom } from 'rxjs';
import { AppState, WorkerSources } from '../state';

export function makeFeaturePaused(sources: WorkerSources, target: AppState) {
    return makeFeature$({
        key: 'paused',
        value$: sources.GameEngine.action$.getHandler('paused').pipe(
            withLatestFrom(sources.GameEngine.state$.pipe(
                map((s) => s.paused)
            )),
            map(([_, paused]) => !paused)
        ),
        target
    });
}
