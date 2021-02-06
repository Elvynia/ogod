import { Hybrids } from 'hybrids';
import { ThreeElementScene } from './element';
import { ogodDefineScene } from '@ogod/element-core';
import { threeHybridScene } from './hybrid';

export function threeDefineScene(tagName?: string, stateHybrids: Array<Hybrids<any>> = [],
    overrideHybrids: Array<Hybrids<any>> = []): hybrids.HybridElement<ThreeElementScene> {
    return ogodDefineScene(tagName || 'three-scene', [threeHybridScene(), ...stateHybrids], overrideHybrids) as hybrids.HybridElement<ThreeElementScene>;
}