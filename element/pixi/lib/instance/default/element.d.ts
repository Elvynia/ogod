import { OgodElementInstance } from '@ogod/element-core';
export interface PixiElementInstance extends OgodElementInstance {
    x: number;
    y: number;
    scaleX: number;
    scaleY: number;
    rotation: number;
    index: number;
    resource: string;
}
