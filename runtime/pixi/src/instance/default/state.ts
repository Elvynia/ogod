import { OgodStateInstance } from '@ogod/common';

export interface PixiStateInstance extends OgodStateInstance {
    resource: string;
    resource$: any;
    instance$: PIXI.DisplayObject;
    x: number;
    y: number;
    scale?: number;
    scaleX: number;
    scaleY: number;
    rotation: number;
    index: number;
}
