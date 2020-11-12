import { Box2dElementShape } from "../shape/element";

export interface Box2dElementShapeBox extends Box2dElementShape {
    centerX: number;
    centerY: number;
    angle: number;
}
