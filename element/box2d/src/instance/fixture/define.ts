import { ogodDefineActorAsync } from '@ogod/element-core';
import { Hybrids } from 'hybrids';
import { box2dHybridFixture } from './hybrid';

export function box2dDefineFixture(tagName?: string, stateHybrids: Array<Hybrids<any>> = [], overrideHybrids: Array<Hybrids<any>> = []) {
    ogodDefineActorAsync(tagName || 'box2d-fixture', box2dHybridFixture(), stateHybrids, overrideHybrids);
}
