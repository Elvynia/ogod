import { Hybrids } from 'hybrids';
import { ogodHybridCamera } from "./hybrid";
import { ogodDefineElement } from '../../define';
import { ogodHybridStateAsync } from '../../state/async/hybrid';

export function ogodDefineCamera(tagName?: string, stateHybrids: Array<Hybrids<any>> = [], overrideHybrids: Array<Hybrids<any>> = []) {
    ogodDefineElement(tagName || 'ogod-camera', ogodHybridCamera(), stateHybrids,
        [ ...overrideHybrids, ogodHybridStateAsync()]);
}
