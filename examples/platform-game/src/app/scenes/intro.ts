import { makeFeatureArray, makeFeatureConstant } from '@ogod/game-engine-driver';
import { concat } from 'rxjs';
import { makeFeatureBackgroundCreate } from '../background/make';
import { makeFeatureLoadMap$ } from '../map/make';
import { makeFeaturePrepareShapes$ } from '../shape/make';
import { WorkerSources } from '../state';

export function makeIntroScene(sources: WorkerSources) {
    return makeFeatureArray([
        makeFeatureLoadMap$(sources),
        makeFeaturePrepareShapes$(sources),
        makeFeatureBackgroundCreate(),
        makeFeatureConstant('loaded', true)
    ], concat);
}
