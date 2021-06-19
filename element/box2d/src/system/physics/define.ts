import { Hybrids } from 'hybrids';
import { ogodDefineSystem, ogodFactorySystemArrayString } from "@ogod/element-core";
import { box2dHybridPhysics } from "./hybrid";

export function box2dDefinePhysics(tagName?: string, stateHybrids: Array<Hybrids<any>> = [], overrideHybrids: Array<Hybrids<any>> = []) {
    ogodDefineSystem(tagName || 'box2d-physics', [box2dHybridPhysics(), ...stateHybrids],
        [{ runtime: 'physics', aspects: ogodFactorySystemArrayString(['body']) }, ...overrideHybrids]);
}
