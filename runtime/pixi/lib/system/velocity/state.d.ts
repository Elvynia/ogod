import { OgodStateSystem } from "@ogod/common";
export interface PixiStateVelocity extends OgodStateSystem {
    modifier: 'default' | 'world' | 'physics';
}
