import { b2Body, b2BodyDef, b2BodyType, b2World } from '@flyover/box2d';
import { box2dCreateFixture } from '../fixture/runtime';
import { box2dCreateSensor } from '../sensor/runtime';
import { hasSensors } from '../sensor/state';
import { Box2dStateInstanceBody } from './state';

export function box2dCreateBody(world: b2World, state: Box2dStateInstanceBody): b2Body {
    const body = state.body;
    state.contacts = {};
    const bd = new b2BodyDef();
    bd.position.Set(body.x, body.y);
    if (body.dynamic) {
        bd.type = b2BodyType.b2_dynamicBody;
        bd.fixedRotation = body.fixedRotation || false;
    }
    const b = world.CreateBody(bd);
    for (let fx of body.fixtures) {
        box2dCreateFixture(b, fx);
    }
    if (body.angle) {
        b.SetAngle(body.angle);
    }
    b.SetUserData(state);
    if (hasSensors(state)) {
        state.sensors.forEach((sensor) => box2dCreateSensor(b, sensor));
    }
    return b;
}
