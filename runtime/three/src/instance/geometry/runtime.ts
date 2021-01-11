import { ThreeRuntimeEngine } from './../../engine/runtime';
import { ThreeStateGeometry } from './state';

declare var self: ThreeRuntimeEngine;

export function threeCreateGeometry(state: ThreeStateGeometry) {
    const ctor: any = self.registry.entries[`geometry.${state.type}${state.buffered ? 'Buffer' : ''}`];
    if (ctor) {
        return new ctor(...state.args);
    }
}
