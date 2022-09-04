import { makeFeatureArray, makeFeatureObservable } from '@ogod/game-engine-driver';
import { makeShapes$ } from '../shape/make';
import { WorkerSources } from '../state';

export function makePlayScene(sources: WorkerSources) {
    return makeFeatureArray([
        makeFeatureObservable('controls', sources.GameEngine.actions.controls, {}),
        makeFeatureObservable('shapes', makeShapes$(sources))
    ]);
}
