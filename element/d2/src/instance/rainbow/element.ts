import { OgodElementInstance } from '@ogod/element-core';

export interface D2ElementRainbow extends OgodElementInstance {
    colors: string[];
    step: number;
    x: number;
    y: number;
    width: number;
    height: number;
    index: number;
    time: number;
    tx: number;
}
