import { makeFeatureComplex } from '@ogod/game-engine-driver';
import { concat, of } from 'rxjs';
import { WorkerSources } from '../state';
import { makeIntroScene } from './intro';
import { makePlayScene } from './play';
import { makeSplashScene } from './splash';

export function makeFeatureScene(sources: WorkerSources) {
    return makeFeatureComplex(concat(
        of(makeSplashScene(sources)),
        of(makeIntroScene(sources)),
        of(makePlayScene(sources))
    ));
}
