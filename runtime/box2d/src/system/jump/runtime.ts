import { Box2dStateInstanceJump } from './../../instance/jump/state';
import { b2FixtureDef, b2PolygonShape, b2Vec2, b2ContactListener, b2Contact } from '@flyover/box2d';
import { map, distinctUntilChanged, filter, skipWhile, tap, take, switchMapTo } from 'rxjs/operators';
import { OgodRuntimeSystemDefault, OgodRuntimeEngine } from '@ogod/runtime-core';
import { Observable } from 'rxjs';
import { OgodStateEngine, OgodActionSystem } from '@ogod/common';
import { Box2dStateJump } from './state';
import { Box2dStatePhysics } from '../physics/state';

declare var self: OgodRuntimeEngine;

export class JumpContactListener extends b2ContactListener {

    BeginContact(contact: b2Contact) {
        const dataA = contact.GetFixtureA().GetUserData();
        const dataB = contact.GetFixtureB().GetUserData();
        console.log('CONTACT ', contact.GetFixtureA().GetBody().GetUserData().id, contact.GetFixtureB().GetBody().GetUserData().id);
        if (dataA && dataA.footSensor || dataB && dataB.footSensor) {
            const id = dataA && dataA.footSensor ? dataA.id : dataB.id;
            const state = self.store.getState().instance[id] as Box2dStateInstanceJump;
            state.footContacts = (state.footContacts || 0) + 1;
            state.grounded = true;
        }
    }

    EndContact(contact: b2Contact) {
        const dataA = contact.GetFixtureA().GetUserData();
        const dataB = contact.GetFixtureB().GetUserData();
        if (dataA && dataA.footSensor || dataB && dataB.footSensor) {
            const id = dataA && dataA.footSensor ? dataA.id : dataB.id;
            const state = self.store.getState().instance[id] as Box2dStateInstanceJump;
            state.footContacts = state.footContacts - 1;
            state.grounded = state.footContacts > 0;
        }
    }
}

export class Box2dRuntimeJump extends OgodRuntimeSystemDefault {

    initialize(state: Box2dStateJump, state$: Observable<OgodStateEngine>): Observable<OgodActionSystem> {
        state.subscriptions = {};
        return state$.pipe(
            skipWhile((fs) => !fs.system[state.physicsId] || !(fs.system[state.physicsId] as Box2dStatePhysics).world$),
            map((fs) => (fs.system[state.physicsId] as Box2dStatePhysics).world$),
            tap((world) => {
                world.SetContactListener(new JumpContactListener());
            }),
            take(1),
            switchMapTo(super.initialize(state, state$))
        );
    }

    add(state: Box2dStateJump, instance: Box2dStateInstanceJump): void {
        super.add(state, instance);
        const body = instance.body$;
        state.subscriptions[instance.id] = self.update$.pipe(
            map(() => ({ jumping: instance.jumping, grounded: instance.grounded, body: instance.body$ })),
            distinctUntilChanged((a, b) => a.jumping === b.jumping && a.grounded === b.grounded),
            // tap((i) => console.log('CHECK JUMP %s:', instance.id, i)),
            filter((instance) => instance.jumping && instance.grounded),
            // FIXME: Delay when falling on ground before jumping again, wait velocityY === 0 ?
            // delay(10)
        ).subscribe(() => {
            const impulse = instance.body$.GetMass() * state.force;
            body.ApplyLinearImpulse(new b2Vec2(0, impulse), body.GetWorldCenter());
        });
        const fd = new b2FixtureDef();
        const box = new b2PolygonShape();
        box.SetAsBox(1, 0.1, new b2Vec2(0, instance.sensorY || 0));
        fd.shape = box;
        fd.density = 1;
        fd.isSensor = true;
        const f = body.CreateFixture(fd);
        f.SetUserData({
            id: instance.id,
            footSensor: true
        });
    }

    remove(state: Box2dStateJump, id: string, instance: Box2dStateInstanceJump): void {
        super.remove(state, id, instance);
        // FIXME: Remove footSensor !
    }
}