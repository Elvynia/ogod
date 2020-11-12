import { Hybrids } from 'hybrids';
import { ogodDefineElement } from '../define';
import { ogodHybridEngine } from './hybrid';

export function ogodDefineEngine(tagName: string = 'ogod-engine', stateHybrids?: Hybrids<any>[], overrideHybrids?: Hybrids<any>[]) {
    return ogodDefineElement(tagName, ogodHybridEngine(), stateHybrids, overrideHybrids);
}
