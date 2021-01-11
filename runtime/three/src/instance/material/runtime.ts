import { ThreeStateMaterial } from './state';
import { ThreeRuntimeEngine } from './../../engine/runtime';

declare var self: ThreeRuntimeEngine;

export function threeCreateMaterial(state: ThreeStateMaterial) {
    const ctor: any = self.registry.entries[`material.${state.type}`];
    if (ctor) {
        return new ctor(...state.args);
    }
}
