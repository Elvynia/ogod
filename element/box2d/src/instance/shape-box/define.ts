import { Hybrids } from 'hybrids';
import { ogodDefineElement } from '@ogod/element-core';
import { ogodHybridStateAsync } from '@ogod/element-core';
import { box2dHybridShapeBox } from './hybrid';

export function box2dDefineShapeBox(tagName?: string, stateHybrids: Array<Hybrids<any>> = [], overrideHybrids: Array<Hybrids<any>> = []) {
    ogodDefineElement(tagName || 'box2d-shape-box', box2dHybridShapeBox(), stateHybrids,
    [ ...overrideHybrids, ogodHybridStateAsync()]);
}
