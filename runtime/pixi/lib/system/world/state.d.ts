import { OgodStateSystem } from '@ogod/common';
export interface PixiStateWorld extends OgodStateSystem {
    follow: string;
    bounds: {
        minX: number;
        minY: number;
        maxX: number;
        maxY: number;
    };
    camera: {
        x: number;
        y: number;
        width: number;
        height: number;
        worldX: number;
        worldY: number;
        offset: {
            minX: number;
            minY: number;
            maxX: number;
            maxY: number;
        };
    };
    translation: {
        x: number;
        y: number;
    };
}
