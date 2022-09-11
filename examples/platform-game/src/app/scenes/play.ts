import { makeFeatureArray, makeFeatureObservable } from '@ogod/game-engine-driver';
import { Observable, map, withLatestFrom } from 'rxjs';
import { Controls } from '../controls/state';
import { makeFeatureUpdateShapes } from '../shape/make';
import { AppState, WorkerSources } from '../state';

export function makePlayScene(sources: WorkerSources) {
    return makeFeatureArray<Pick<AppState, 'controls' | 'shapes' | 'paused'>>([
        makeFeatureObservable('controls', sources.GameEngine.actions.controls as Observable<Controls>, {} as Controls),
        makeFeatureUpdateShapes(sources),
        makeFeatureObservable('paused', sources.GameEngine.actions.paused.pipe(
            withLatestFrom(sources.GameEngine.state$.pipe(
                map((s) => s.paused)
            )),
            map(([_, paused]) => !paused)
        ), false)
    ]);
}
