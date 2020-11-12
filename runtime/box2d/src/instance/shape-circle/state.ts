export interface Box2dStateShapeCircle {
    x: number;
    y: number;
    radius: number;
}

export function isShapeCircle(shape): shape is Box2dStateShapeCircle {
    return shape.radius != null;
}
