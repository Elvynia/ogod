import { OgodElementSystem } from "@ogod/element-core";

export interface PixiElementVelocity extends OgodElementSystem {
    modifier: 'default' | 'world' | 'physics';
}
