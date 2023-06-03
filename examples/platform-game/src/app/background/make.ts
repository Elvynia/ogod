import { FeatureKey, makeStateObject } from '@ogod/driver-engine';
import { of } from 'rxjs';
import { AppState, WorkerSources } from "../state";
import { makeFeatureBackgroundColors } from './color/make';
import { makeFeatureBackgroundGradient } from './gradient/make';
import { Background } from './state';

export function makeFeatureBackground(sources: WorkerSources): FeatureKey<AppState, 'background'> {
    return {
        key: 'background',
        publishOnNext: true,
        value$: makeStateObject({
            key$: of(
                makeFeatureBackgroundColors(sources),
                makeFeatureBackgroundGradient(sources)
            ),
            state: {} as Background
        })
    }
}
