import { OgodRuntimeEngine } from '@ogod/runtime-core';
import { b2Contact, b2ContactListener, b2ManifoldType, b2Vec2 } from '@flyover/box2d';
import { Box2dStateInstanceBody } from '../../../instance/body/state';

export class DefaultContactListener extends b2ContactListener {

    BeginContact(contact: b2Contact) {
        const stateA: Box2dStateInstanceBody = contact.GetFixtureA().GetBody().GetUserData();
        const stateFxA = contact.GetFixtureA().GetUserData();
        const stateB: Box2dStateInstanceBody = contact.GetFixtureB().GetBody().GetUserData();
        const stateFxB = contact.GetFixtureB().GetUserData();
        const idA = stateFxA?.id || stateA?.id;
        const idB = stateFxB?.id || stateB?.id;
        const normal = contact.GetManifold().localNormal.Clone();
        if (contact.GetManifold().type === b2ManifoldType.e_faceB) {
            normal.Set(-normal.x, -normal.y);
            // FIXME: Interpolate localPoint from B to A.
        }
        if (contact.GetFixtureA().IsSensor() || contact.GetFixtureB().IsSensor()) {
            if (contact.GetFixtureA().IsSensor()) {
                ++stateFxA.contacts;
            }
            if (contact.GetFixtureB().IsSensor()) {
                ++stateFxB.contacts;
            }
        } else if (idA && idB) {
            stateA.contacts[idB] = {
                target: stateB,
                fxSource: stateFxA,
                fxTarget: stateFxB,
                normal,
                origin: contact.GetManifold().localPoint.Clone()
            };
            stateB.contacts[idA] = {
                target: stateA,
                fxSource: stateFxB,
                fxTarget: stateFxA,
                normal: new b2Vec2(-normal.x, -normal.y),
                origin: contact.GetManifold().localPoint.Clone()
            };
        }
    }

    EndContact(contact: b2Contact) {
        const stateA: Box2dStateInstanceBody = contact.GetFixtureA().GetBody().GetUserData();
        const stateFxA = contact.GetFixtureA().GetUserData();
        const stateB: Box2dStateInstanceBody = contact.GetFixtureB().GetBody().GetUserData();
        const stateFxB = contact.GetFixtureB().GetUserData();
        const idA = stateFxA?.id || stateA?.id;
        const idB = stateFxB?.id || stateB?.id;
        if (contact.GetFixtureA().IsSensor() || contact.GetFixtureB().IsSensor()) {
            if (contact.GetFixtureA().IsSensor()) {
                --stateFxA.contacts;
            }
            if (contact.GetFixtureB().IsSensor()) {
                --stateFxB.contacts;
            }
        } else if (idA && idB) {
            delete stateA.contacts[idB];
            delete stateB.contacts[idA];
        }
    }
}
