import { ogodDefineActorAsync } from '@ogod/element-core';
import { Hybrids } from 'hybrids';
import { box2dHybridSensor } from './hybrid';

export function box2dDefineSensor(tagName?: string, stateHybrids: Array<Hybrids<any>> = [], overrideHybrids: Array<Hybrids<any>> = []) {
    ogodDefineActorAsync(tagName || 'box2d-sensor', box2dHybridSensor(), stateHybrids, overrideHybrids);
}
