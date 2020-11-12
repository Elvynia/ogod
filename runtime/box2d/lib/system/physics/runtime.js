"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Box2dRuntimePhysics = exports.WORLD_STEP = exports.WORLD_RATIO = void 0;
const operators_1 = require("rxjs/operators");
const box2d_1 = require("@flyover/box2d");
const runtime_core_1 = require("@ogod/runtime-core");
const rxjs_1 = require("rxjs");
const runtime_1 = require("../../instance/body/runtime");
exports.WORLD_RATIO = 10;
exports.WORLD_STEP = 1 / 20;
const velocityIterations = 8;
const positionIterations = 3;
class Box2dRuntimePhysics extends runtime_core_1.OgodRuntimeSystemDefault {
    initialize(state, state$) {
        this.time = 0;
        state.world$ = new box2d_1.b2World(new box2d_1.b2Vec2(state.gravityX || 0, state.gravityY || 0));
        this.refreshModifiers(state);
        return super.initialize(state, state$);
    }
    add(state, instance) {
        super.add(state, instance);
        instance.body$ = runtime_1.box2dCreateBody(state.world$, instance.body, instance.id);
    }
    remove(state, id, instance) {
        state.world$.DestroyBody(instance.body$);
        delete instance.body$;
        super.remove(state, id, instance);
    }
    update(delta, state) {
        this.time += delta;
        while (this.time >= exports.WORLD_STEP * 1000) {
            this.time -= exports.WORLD_STEP * 1000;
            state.world$.Step(exports.WORLD_STEP, velocityIterations, positionIterations);
        }
        const fullState = self.store.getState();
        rxjs_1.from(state.entities).pipe(operators_1.map((id) => fullState.instance[id]), operators_1.filter((instance) => instance.body.dynamic && instance.body$)).subscribe((instance) => {
            instance[state.modifierX] = instance.body$.GetPosition().x * exports.WORLD_RATIO;
            instance[state.modifierY] = instance.body$.GetPosition().y * exports.WORLD_RATIO;
        });
    }
    destroy(state) {
        delete state.world$;
        return super.destroy(state);
    }
    refreshModifiers(state) {
        if (state.modifier) {
            state.modifierX = state.modifier + (state.modifierX ? state.modifierX[0].toUpperCase() + state.modifierX.substring(1) : 'X');
            state.modifierY = state.modifier + (state.modifierY ? state.modifierY[0].toUpperCase() + state.modifierY.substring(1) : 'Y');
        }
        else {
            state.modifierX = state.modifierX ? state.modifierX.toLowerCase() : 'x';
            state.modifierY = state.modifierY ? state.modifierY.toLowerCase() : 'y';
        }
    }
}
exports.Box2dRuntimePhysics = Box2dRuntimePhysics;
//# sourceMappingURL=runtime.js.map