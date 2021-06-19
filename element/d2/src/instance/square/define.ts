import { ogodDefineInstance } from '@ogod/element-core';
import { Hybrids } from 'hybrids';
import { d2HybridInstance } from '../instance/hybrid';
import { D2ElementShape } from '../shape/element';
import { d2HybridSize } from '../size/hybrid';

export function d2DefineSquare(tagName?: string, stateHybrids: Array<Hybrids<any>> = [], overrideHybrids: Array<Hybrids<any>> = []): hybrids.HybridElement<D2ElementShape> {
    return ogodDefineInstance(tagName || 'd2-square', [d2HybridInstance(), d2HybridSize(), ...stateHybrids],
        [{
            runtime: 'square'
        }, ...overrideHybrids]) as hybrids.HybridElement<D2ElementShape>;
}
