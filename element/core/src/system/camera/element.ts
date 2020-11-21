import { OgodElementArea } from "../area/element";

export interface OgodElementCamera extends HTMLElement {
    category: string;
    x: number;
    y: number;
    width: number;
    height: number;
    worldX: number;
    worldY: number;
    offset: OgodElementArea;
}
