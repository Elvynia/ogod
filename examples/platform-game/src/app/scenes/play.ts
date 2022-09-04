import { makeFeatureArray, makeFeatureObservable } from '@ogod/game-engine-driver';
import { Observable } from 'rxjs';
import { Controls } from '../controls/state';
import { makeShapes$ } from '../shape/make';
import { AppState, WorkerSources } from '../state';

export function makePlayScene(sources: WorkerSources) {
    return makeFeatureArray<Pick<AppState, 'controls' | 'shapes'>>([
        makeFeatureObservable('controls', sources.GameEngine.actions.controls as Observable<Controls>, {} as Controls),
        makeFeatureObservable('shapes', makeShapes$(sources))
    ]);
}
