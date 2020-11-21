import { Hybrids } from 'hybrids';
import { ogodHybridArea } from './hybrid';
import { ogodDefineElement } from '../../define';
import { ogodHybridStateAsync } from '../../state/async/hybrid';

export function ogodDefineArea(tagName?: string, stateHybrids: Array<Hybrids<any>> = [], overrideHybrids: Array<Hybrids<any>> = []) {
    ogodDefineElement(tagName || 'ogod-area', ogodHybridArea(), stateHybrids,
        [ ...overrideHybrids, ogodHybridStateAsync()]);
}
