import { Hybrids } from 'hybrids';
import { ogodDefineElement, ogodHybridStateAsync } from '@ogod/element-core';
import { box2dHybridFixture } from './hybrid';

export function box2dDefineFixture(tagName?: string, stateHybrids: Array<Hybrids<any>> = [], overrideHybrids: Array<Hybrids<any>> = []) {
    ogodDefineElement(tagName || 'box2d-fixture', box2dHybridFixture(), stateHybrids,
        [ ...overrideHybrids, ogodHybridStateAsync()]);
}
