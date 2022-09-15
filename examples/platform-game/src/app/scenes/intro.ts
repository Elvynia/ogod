import { makeFeature$ } from '@ogod/game-engine-driver';
import { concat, of } from 'rxjs';
import { makeFeatureBackgroundLoad } from '../background/make';
import { makeFeatureLoadMap } from '../map/make';
import { AppState, WorkerSources } from '../state';

export function makeSceneLoad(sources: WorkerSources, target: AppState) {
    return concat(
        makeFeatureLoadMap(sources, target),
        makeFeatureBackgroundLoad(sources, target),
        makeFeature$({
            key: 'loaded',
            value$: of(true),
            target
        })
    );
}
