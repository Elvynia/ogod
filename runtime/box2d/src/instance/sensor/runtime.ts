import { b2Body, b2FixtureDef } from '@flyover/box2d';
import { box2dCreateShape } from '../shape/runtime';
import { Box2dStateSensor } from "./state";

export function box2dCreateSensor(body: b2Body, sensor: Box2dStateSensor) {
    const shape = box2dCreateShape(sensor.shape);
    const fd = new b2FixtureDef();
    fd.shape = shape;
    fd.isSensor = true;
    // fd.density = fx.density || fd.density;
    // fd.friction = fx.friction || fd.friction;
    // fd.restitution = fx.restitution || fd.restitution;
    fd.userData = sensor;
    body.CreateFixture(fd);
}
