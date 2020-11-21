import { Hybrids } from 'hybrids';
import { ogodHybridWorld } from './hybrid';
import { ogodDefineSystem } from '../define';

export function ogodDefineWorld(tagName?: string, stateHybrids: Array<Hybrids<any>> = [], overrideHybrids: Array<Hybrids<any>> = []) {
    ogodDefineSystem(tagName || 'ogod-world',
        [ogodHybridWorld(), ...stateHybrids],
        [{ runtime: 'world' }, ...overrideHybrids]
    );
}
