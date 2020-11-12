import { b2World, b2Body, b2BodyType, b2BodyDef, b2FixtureDef, b2PolygonShape, b2CircleShape, b2Shape } from '@flyover/box2d';
import { Box2dStateBody } from './state';
import { isShapeBox } from '../shape-box/state';
import { isShapeCircle } from '../shape-circle/state';

export function box2dCreateBody(world: b2World, body: Box2dStateBody, id: string): b2Body {
    const bd = new b2BodyDef();
    bd.position.Set(body.x, body.y);
    if (body.dynamic) {
        bd.type = b2BodyType.b2_dynamicBody;
        bd.fixedRotation = body.fixedRotation || false;
    }
    const b = world.CreateBody(bd);
    let shape: b2Shape;
    if (isShapeBox(body.shape)) {
        const boxShape = new b2PolygonShape();
        boxShape.SetAsBox(body.shape.x, body.shape.y, {
            x: body.shape.centerX || 0,
            y: body.shape.centerY || 0
        }, body.shape.angle);
        shape = boxShape;
    } else if (isShapeCircle(body.shape)) {
        const circleShape = new b2CircleShape(body.shape.radius);
        circleShape.Set({ x: body.shape.x, y: body.shape.y });
        shape = circleShape;
    } else {
        const polyShape = new b2PolygonShape();
        polyShape.Set(body.shape.vertices);
        shape = polyShape;
    }
    const fd = new b2FixtureDef();
    fd.shape = shape;
    fd.density = body.density || 1;
    fd.friction = body.friction || fd.friction;
    fd.restitution = body.restitution || fd.restitution;
    b.CreateFixture(fd);
    b.SetUserData({
        id
    });
    return b;
}
