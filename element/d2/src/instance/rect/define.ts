import { ogodDefineInstance } from '@ogod/element-core';
import { Hybrids } from 'hybrids';
import { d2HybridInstance } from '../instance/hybrid';
import { D2ElementShape } from '../shape/element';
import { d2HybridSizeXY } from '../size/hybrid';

export function d2DefineRect(tagName?: string, stateHybrids: Array<Hybrids<any>> = [], overrideHybrids: Array<Hybrids<any>> = []): hybrids.HybridElement<D2ElementShape> {
    return ogodDefineInstance(tagName || 'd2-rect', [d2HybridInstance(), d2HybridSizeXY(), ...stateHybrids],
        [...overrideHybrids, {
            runtime: 'rect'
        }]) as hybrids.HybridElement<D2ElementShape>;
}
