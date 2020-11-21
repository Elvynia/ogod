import { OgodStateArea } from '../area/state';

export interface OgodStateCamera {
    x: number;
    y: number;
    width: number;
    height: number;
    worldX: number;
    worldY: number;
    offset: OgodStateArea;
}
