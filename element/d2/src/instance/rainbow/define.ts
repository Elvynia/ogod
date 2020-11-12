import { ogodDefineInstance } from '@ogod/element-core';
import { Hybrids } from 'hybrids';
import { D2ElementRainbow } from './element';
import { d2HybridRainbow } from './hybrid';

export function d2DefineRainbow(tagName?: string, stateHybrids: Array<Hybrids<any>> = [], overrideHybrids: Array<Hybrids<any>> = []): hybrids.HybridElement<D2ElementRainbow> {
    return ogodDefineInstance(tagName || 'd2-rainbow', [d2HybridRainbow(), ...stateHybrids],
        [...overrideHybrids, {
            runtime: 'rainbow'
        }]) as hybrids.HybridElement<D2ElementRainbow>;
}
