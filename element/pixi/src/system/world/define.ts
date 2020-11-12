import { Hybrids } from 'hybrids';
import { ogodDefineSystem } from "@ogod/element-core";
import { pixiHybridWorld } from './hybrid';

export function pixiDefineWorld(tagName?: string, stateHybrids: Array<Hybrids<any>> = [], overrideHybrids: Array<Hybrids<any>> = []) {
    ogodDefineSystem(tagName || 'pixi-world',
        [pixiHybridWorld(), ...stateHybrids],
        [{ runtime: 'world' }, ...overrideHybrids]
    );
}
