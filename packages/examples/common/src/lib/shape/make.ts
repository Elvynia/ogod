import { makeRandColor } from "../color/make";
import { makeRandInRange, makeRandNum } from "../util";
import { Shape, ShapeType, ShapeTypes } from "./type";

export function makeRandShapeType(): ShapeType {
    return ShapeTypes[Math.floor(Math.random() * ShapeTypes.length)];
}

export function makeRandShape(shape: Partial<Shape>): Shape {
    return {
        color: shape.color || makeRandColor(),
        id: shape.id || makeRandNum().toString(),
        opacity: shape.opacity ?? makeRandInRange(0, 1),
        x: shape.x || 0,
        y: shape.y || 0,
        type: makeRandShapeType()
    }
}
