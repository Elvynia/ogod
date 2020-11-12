import { OgodStateInstance } from '@ogod/common';

export interface D2StateRainbow extends OgodStateInstance {
    colors: Array<string>;
    step: number;
    time: number;
    index: number;
    x: number;
    y: number;
    width: number;
    height: number;
    tx?: number;
    ty?: number;
}
