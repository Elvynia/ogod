import { Feature } from '@ogod/game-core';
import { makeFeatureLoadMap$ } from '../map/make';
import { WorkerSources } from '../state';

export function makeIntroScene(sources: WorkerSources): Feature[] {
    return [makeFeatureLoadMap$(sources)];
}
