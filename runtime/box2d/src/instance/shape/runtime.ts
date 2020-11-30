import { Box2dStateShapePoly } from '../shape-poly/state';
import { Box2dStateShapeCircle, isShapeCircle } from '../shape-circle/state';
import { Box2dStateShapeBox, isShapeBox } from '../shape-box/state';
import { b2Body, b2CircleShape, b2PolygonShape, b2Shape } from '@flyover/box2d';

export function box2dCreateShape(source: Box2dStateShapeBox | Box2dStateShapeCircle | Box2dStateShapePoly): b2Shape {
    let shape: b2Shape;
    if (isShapeBox(source)) {
        const boxShape = new b2PolygonShape();
        boxShape.SetAsBox(source.x, source.y, {
            x: source.centerX || 0,
            y: source.centerY || 0
        }, source.angle);
        shape = boxShape;
    } else if (isShapeCircle(source)) {
        const circleShape = new b2CircleShape(source.radius);
        circleShape.Set({ x: source.x, y: source.y });
        shape = circleShape;
    } else {
        const polyShape = new b2PolygonShape();
        polyShape.Set(source.vertices);
        shape = polyShape;
    }
    return shape;
}