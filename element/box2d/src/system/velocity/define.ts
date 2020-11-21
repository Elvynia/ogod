import { Hybrids } from 'hybrids';
import { ogodDefineSystem, ogodFactorySystemArrayString } from "@ogod/element-core";
import { box2dHybridVelocity } from "./hybrid";

export function box2dDefineVelocity(tagName?: string, stateHybrids: Array<Hybrids<any>> = [], overrideHybrids: Array<Hybrids<any>> = []) {
    ogodDefineSystem(tagName || 'box2d-velocity', [box2dHybridVelocity(), ...stateHybrids],
        [...overrideHybrids, { runtime: 'velocity', aspects: ogodFactorySystemArrayString(['tx']) }]);
}
