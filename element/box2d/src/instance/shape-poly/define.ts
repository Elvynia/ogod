import { Hybrids } from 'hybrids';
import { ogodDefineElement } from '@ogod/element-core';
import { ogodHybridStateAsync } from '@ogod/element-core';
import { box2dHybridShapePoly } from './hybrid';

export function box2dDefineShapePoly(tagName?: string, stateHybrids: Array<Hybrids<any>> = [], overrideHybrids: Array<Hybrids<any>> = []) {
    ogodDefineElement(tagName || 'box2d-shape-poly', box2dHybridShapePoly(), stateHybrids,
    [ ...overrideHybrids, ogodHybridStateAsync()]);
}
