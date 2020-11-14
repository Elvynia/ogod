import { Hybrids } from 'hybrids';
import { ogodDefineElement } from '../define';
import { ogodHybridEngine } from './hybrid';

export function ogodDefineEngine(tagName?: string, stateHybrids?: Hybrids<any>[], overrideHybrids?: Hybrids<any>[]) {
    return ogodDefineElement(tagName || 'ogod-engine', ogodHybridEngine(), stateHybrids, overrideHybrids);
}
