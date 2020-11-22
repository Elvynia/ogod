import { Hybrids } from 'hybrids';
import { ogodDefineElement, ogodHybridStateAsync } from '@ogod/element-core';
import { box2dHybridSensor } from './hybrid';

export function box2dDefineSensor(tagName?: string, stateHybrids: Array<Hybrids<any>> = [], overrideHybrids: Array<Hybrids<any>> = []) {
    ogodDefineElement(tagName || 'box2d-sensor', box2dHybridSensor(), stateHybrids,
        [ ...overrideHybrids, ogodHybridStateAsync()]);
}
