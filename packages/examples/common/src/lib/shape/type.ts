import { Circle } from "../circle/type";
import { Rect } from "../rect/type";
import { XY } from "../xy.type";

export const ShapeTypes = ['rect', 'circle'] as const;
export type ShapeType = typeof ShapeTypes[number];
export type AnyShape = Rect | Circle;

export interface Shape extends XY {
    id: string;
    color: string | CanvasGradient | CanvasPattern;
    opacity: number;
    type: ShapeType;
}
