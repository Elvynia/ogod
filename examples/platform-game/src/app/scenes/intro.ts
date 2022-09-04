import { makeFeatureLoadMap$ } from '../map/make';
import { WorkerSources } from '../state';

export function makeIntroScene(sources: WorkerSources) {
    return makeFeatureLoadMap$(sources);
}
