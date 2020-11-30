import { b2Body, b2Fixture, b2FixtureDef } from '@flyover/box2d';
import { box2dCreateShape } from '../shape/runtime';
import { Box2dStateFixture } from './state';

export function box2dCreateFixture(body: b2Body, fx: Box2dStateFixture): b2Fixture {
    const shape = box2dCreateShape(fx.shape);
    const fd = new b2FixtureDef();
    fd.shape = shape;
    fd.density = fx.density || fd.density;
    fd.friction = fx.friction || fd.friction;
    fd.restitution = fx.restitution || fd.restitution;
    return body.CreateFixture(fd);
}
