import { FeatureKey, makeFeatureObject$ } from '@ogod/game-engine-driver';
import { of } from 'rxjs';
import { AppState, WorkerSources } from "../state";
import { makeBackgroundColors, makeFeatureBackgroundColors } from './color/make';
import { makeFeatureBackgroundGradient } from './gradient/make';
import { Background } from './state';

export function makeFeatureBackground(sources: WorkerSources): FeatureKey<AppState, 'background'> {
    return {
        key: 'background',
        value$: makeFeatureObject$({
            key$: of(
                makeFeatureBackgroundColors(sources),
                makeFeatureBackgroundGradient(sources)
            ),
            state$: of(makeBackgroundColors('#ff00ff') as Background)
        })
    }
}
