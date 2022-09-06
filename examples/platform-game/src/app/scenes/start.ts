import { makeFeatureObservable } from '@ogod/game-engine-driver';
import { first } from 'rxjs';
import { WorkerSources } from '../state';

export function makeSceneStart(sources: WorkerSources) {
    return makeFeatureObservable('start', sources.GameEngine.actions.start.pipe(
        first()
    ), false)
}
