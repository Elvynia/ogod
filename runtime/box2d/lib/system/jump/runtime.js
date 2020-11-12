"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Box2dRuntimeJump = exports.JumpContactListener = void 0;
const box2d_1 = require("@flyover/box2d");
const operators_1 = require("rxjs/operators");
const runtime_core_1 = require("@ogod/runtime-core");
class JumpContactListener extends box2d_1.b2ContactListener {
    BeginContact(contact) {
        const dataA = contact.GetFixtureA().GetUserData();
        const dataB = contact.GetFixtureB().GetUserData();
        if (dataA && dataA.footSensor || dataB && dataB.footSensor) {
            const id = dataA && dataA.footSensor ? dataA.id : dataB.id;
            const state = self.store.getState().instance[id];
            state.footContacts = (state.footContacts || 0) + 1;
            state.grounded = true;
        }
    }
    EndContact(contact) {
        const dataA = contact.GetFixtureA().GetUserData();
        const dataB = contact.GetFixtureB().GetUserData();
        if (dataA && dataA.footSensor || dataB && dataB.footSensor) {
            const id = dataA && dataA.footSensor ? dataA.id : dataB.id;
            const state = self.store.getState().instance[id];
            state.footContacts = state.footContacts - 1;
            state.grounded = state.footContacts > 0;
        }
    }
}
exports.JumpContactListener = JumpContactListener;
class Box2dRuntimeJump extends runtime_core_1.OgodRuntimeSystemDefault {
    initialize(state, state$) {
        state.subscriptions = {};
        return state$.pipe(operators_1.skipWhile((fs) => !fs.system[state.physicsId] || !fs.system[state.physicsId].world$), operators_1.map((fs) => fs.system[state.physicsId].world$), operators_1.tap((world) => {
            world.SetContactListener(new JumpContactListener());
        }), operators_1.take(1), operators_1.switchMapTo(super.initialize(state, state$)));
    }
    add(state, instance) {
        super.add(state, instance);
        state.subscriptions[instance.id] = self.update$.pipe(operators_1.map(() => ({ jumping: instance.jumping, grounded: instance.grounded, body: instance.body$ })), operators_1.distinctUntilChanged((a, b) => a.jumping === b.jumping && a.grounded === b.grounded), 
        // tap((i) => console.log('CHECK JUMP %s:', instance.id, i)),
        operators_1.filter((instance) => instance.jumping && instance.grounded)).subscribe(() => {
            const impulse = instance.body$.GetMass() * state.force;
            body.ApplyLinearImpulse(new box2d_1.b2Vec2(0, impulse), body.GetWorldCenter());
        });
        const body = instance.body$;
        const fd = new box2d_1.b2FixtureDef();
        const box = new box2d_1.b2PolygonShape();
        // FIXME: Foot sensor location.
        box.SetAsBox(1, 0.1, new box2d_1.b2Vec2(0, instance.sensorY || 0));
        fd.shape = box;
        fd.density = 1;
        fd.isSensor = true;
        const f = body.CreateFixture(fd);
        f.SetUserData({
            id: instance.id,
            footSensor: true
        });
    }
    remove(state, id, instance) {
        super.remove(state, id, instance);
        // FIXME: Remove footSensor !
    }
}
exports.Box2dRuntimeJump = Box2dRuntimeJump;
//# sourceMappingURL=runtime.js.map