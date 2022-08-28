import { makeFeatureComplex } from '@ogod/game-engine-driver';
import { concat, of } from 'rxjs';
import { WorkerSources } from '../state';
import { makeIntroScene } from './intro';
import { makePlayScene$ } from './play';

export function makeFeatureScene(sources: WorkerSources) {
    return makeFeatureComplex(concat(
        of(makeIntroScene(sources)),
        makePlayScene$(sources)
    ));
}
