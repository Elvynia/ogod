import { FeatureKey, makeStateObject } from '@ogod/game-engine-driver';
import { of } from 'rxjs';
import { AppState, WorkerSources } from "../state";
import { makeBackgroundColors, makeFeatureBackgroundColors } from './color/make';
import { makeFeatureBackgroundGradient } from './gradient/make';
import { Background } from './state';

export function makeFeatureBackground(sources: WorkerSources): FeatureKey<AppState, 'background'> {
    return {
        key: 'background',
        value$: makeStateObject({
            key$: of(
                makeFeatureBackgroundColors(sources),
                makeFeatureBackgroundGradient(sources)
            ),
            state: makeBackgroundColors('#ff00ff') as Background
        })
    }
}
