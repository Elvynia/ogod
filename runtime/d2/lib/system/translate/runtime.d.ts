import { OgodRuntimeSystemDefault } from '@ogod/runtime-core';
import { D2StateShape } from '../../instance/shape/state';
import { D2StateTranslate } from './state';
export declare class D2RuntimeTranslate extends OgodRuntimeSystemDefault {
    update(delta: number, state: D2StateTranslate): void;
    updateInfinite(instance: D2StateShape): void;
    updateBounce(instance: D2StateShape): void;
    getWidth(instance: D2StateShape): number;
    getHeight(instance: D2StateShape): number;
}
