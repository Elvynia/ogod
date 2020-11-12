import { OgodStateInstance } from '@ogod/common';

export interface D2StateInstance extends OgodStateInstance {
    color: string;
    x: number;
    y: number;
    tx: number;
    ty: number;
    angle?: number;
}
