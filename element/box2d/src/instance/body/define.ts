import { Hybrids } from 'hybrids';
import { ogodDefineElement, ogodHybridStateAsync } from '@ogod/element-core';
import { box2dHybridBody } from './hybrid';

export function box2dDefineBody(tagName?: string, stateHybrids: Array<Hybrids<any>> = [], overrideHybrids: Array<Hybrids<any>> = []) {
    ogodDefineElement(tagName || 'box2d-body', box2dHybridBody(), stateHybrids,
        [ ...overrideHybrids, ogodHybridStateAsync()]);
}
