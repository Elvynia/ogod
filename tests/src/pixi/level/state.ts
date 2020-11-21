import { OgodStateInstance } from "@ogod/common";

export interface PixiStateLevel extends OgodStateInstance {
    resource$: PIXI.Spritesheet;
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
