export interface Box2dStateShapeBox {
    x: number;
    y: number;
    centerX?: number;
    centerY?: number;
    angle?: number;
}

export function isShapeBox(shape): shape is Box2dStateShapeBox {
    return shape.x != null && shape.y != null && shape.radius == null;
}
