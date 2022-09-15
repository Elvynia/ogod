import { Shape } from "../render/state";

export interface CanvasObject {
    id: string;
    x: number;
    y: number;
    v: number;
    s: number;
    c: string;
    shape: Shape;
}

export type ObjectState = Record<string, CanvasObject>;
