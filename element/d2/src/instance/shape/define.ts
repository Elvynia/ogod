import { ogodDefineInstance } from '@ogod/element-core';
import { D2ElementShape } from './element';
import { Hybrids } from 'hybrids';
import { d2HybridShape } from './hybrid';

export function d2DefineShape(tagName?: string, stateHybrids: Array<Hybrids<any>> = [], overrideHybrids: Array<Hybrids<any>> = []): hybrids.HybridElement<D2ElementShape> {
    return ogodDefineInstance(tagName || 'd2-shape', [d2HybridShape(), ...stateHybrids], overrideHybrids) as hybrids.HybridElement<D2ElementShape>;
}
