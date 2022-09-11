import { makeFeatureObservable, makeFeatureArray, makeFeatureConstant } from '@ogod/game-engine-driver';
import { first } from 'rxjs';
import { WorkerSources } from '../state';

export function makeSceneStart(sources: WorkerSources) {
    return makeFeatureArray([
        makeFeatureConstant('initialized', true),
        makeFeatureObservable('start', sources.GameEngine.actions.start.pipe(
            first()
        ), false)
    ])
}
