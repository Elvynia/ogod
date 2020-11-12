import { PixiElementArea } from "../area/element";

export interface PixiElementCamera extends HTMLElement {
    category: string;
    x: number;
    y: number;
    width: number;
    height: number;
    worldX: number;
    worldY: number;
    offset: PixiElementArea;
}
