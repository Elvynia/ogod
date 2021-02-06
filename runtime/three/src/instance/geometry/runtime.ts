import { ThreeRuntimeEngine } from './../../engine/runtime';
import { ThreeStateGeometry } from './state';

declare var self: ThreeRuntimeEngine;

export function threeCreateGeometry(state: ThreeStateGeometry) {
    const type = `geometry.${state.type}${state.buffered ? 'Buffer' : ''}`;
    const ctor: any = self.registry.entries[type];
    if (ctor) {
        return new ctor(...state.args);
    } else {
        console.error('Cannot instance Three Geometry %s: not found in registry.', type);
        return undefined;
    }
}
