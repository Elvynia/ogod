import { Feature } from '@ogod/game-core';
import { makeFeatureObservable } from '@ogod/game-engine-driver';
import { makeShapes$ } from '../shape/make';
import { WorkerSources } from '../state';

export function makePlayScene(sources: WorkerSources): Feature[] {
    return [
        makeFeatureObservable('controls', sources.GameEngine.action$.controls, {}),
        makeFeatureObservable('shapes', makeShapes$(sources))
    ]
}
