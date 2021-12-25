import { OgodStateInstance } from '@ogod/common';
import { DisplayObject } from 'pixi.js';

export interface PixiStateInstance extends OgodStateInstance {
    resource: string;
    resource$: any;
    instance$: DisplayObject;
    x: number;
    y: number;
    scale?: number;
    scaleX: number;
    scaleY: number;
    rotation: number;
    index: number;
}
