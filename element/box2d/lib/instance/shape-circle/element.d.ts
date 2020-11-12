import { Box2dElementShape } from "../shape/element";
export interface Box2dElementShapeCircle extends Box2dElementShape {
    radius: number;
    angle: number;
}
