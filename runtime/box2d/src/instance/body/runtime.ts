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
    for (let fx of body.fixtures) {
        let shape: b2Shape;
        if (isShapeBox(fx.shape)) {
            const boxShape = new b2PolygonShape();
            boxShape.SetAsBox(fx.shape.x, fx.shape.y, {
                x: fx.shape.centerX || 0,
                y: fx.shape.centerY || 0
            }, fx.shape.angle);
            shape = boxShape;
        } else if (isShapeCircle(fx.shape)) {
            const circleShape = new b2CircleShape(fx.shape.radius);
            circleShape.Set({ x: fx.shape.x, y: fx.shape.y });
            shape = circleShape;
        } else {
            const polyShape = new b2PolygonShape();
            polyShape.Set(fx.shape.vertices);
            shape = polyShape;
        }
        const fd = new b2FixtureDef();
        fd.shape = shape;
        fd.density = fx.density || fd.density;
        fd.friction = fx.friction || fd.friction;
        fd.restitution = fx.restitution || fd.restitution;
        b.CreateFixture(fd);
    }
    if (body.angle) {
        b.SetAngle(body.angle);
    }
    b.SetUserData({
        id
    });
    return b;
}
