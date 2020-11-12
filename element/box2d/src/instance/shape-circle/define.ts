import { Hybrids } from 'hybrids';
import { ogodDefineElement } from '@ogod/element-core';
import { ogodHybridStateAsync } from '@ogod/element-core';
import { box2dHybridShapeCircle } from './hybrid';

export function box2dDefineShapeCircle(tagName?: string, stateHybrids: Array<Hybrids<any>> = [], overrideHybrids: Array<Hybrids<any>> = []) {
    ogodDefineElement(tagName || 'box2d-shape-circle', box2dHybridShapeCircle(), stateHybrids,
    [ ...overrideHybrids, ogodHybridStateAsync()]);
}
