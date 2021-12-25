import { OgodStateInstance } from "@ogod/common";
import { Spritesheet } from "pixi.js";

export interface PixiStateLevel extends OgodStateInstance {
    resource$: Spritesheet;
    instance$: any;
    tileExtension: string;
    tileSize: number;
    width: number;
    height: number;
    flatness: number;
    gapFreq: number;
    gapSizeMin: number;
    gapSizeMax: number;
    scale: number;
    worldX: number;
    worldY: number;
    index: number;
    x: number;
    y: number;
}
