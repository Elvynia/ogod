import { Hybrids } from 'hybrids';
import { ogodDefineElement } from '../define';
import { ogodHybridEngine } from './hybrid';
import { OGOD_CATEGORY } from '@ogod/common';

export function ogodDefineEngine(tagName?: string, stateHybrids?: Hybrids<any>[],
    overrideHybrids?: Hybrids<any>[], extraCategories: string[] = []) {
    return ogodDefineElement(tagName || 'ogod-engine', 
        ogodHybridEngine([ ...Object.values(OGOD_CATEGORY), ...extraCategories]), stateHybrids, overrideHybrids);
}
