import { ogodDefineScene } from '@ogod/element-core';
import { Hybrids } from 'hybrids';
import { D2ElementScene } from './element';
import { d2HybridScene } from './hybrid';

export function d2DefineScene(tagName?: string, stateHybrids: Array<Hybrids<any>> = [], overrideHybrids: Array<Hybrids<any>> = []): hybrids.HybridElement<D2ElementScene> {
    return ogodDefineScene(tagName || 'd2-scene', [d2HybridScene(), ...stateHybrids], overrideHybrids) as hybrids.HybridElement<D2ElementScene>;
}
