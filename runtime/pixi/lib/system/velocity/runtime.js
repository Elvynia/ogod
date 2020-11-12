"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PixiRuntimeVelocity = void 0;
const runtime_core_1 = require("@ogod/runtime-core");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const defaultModifier = (delta) => (instance) => {
    instance.instance$.position.x += instance.velocity * delta / 1000;
};
const worldModifier = (delta) => (instance) => {
    instance.worldX += instance.velocity * delta / 1000;
};
const physicsModifider = (delta) => (instance) => {
    if (instance.body$) {
        instance.body$.SetLinearVelocity({
            x: instance.velocity,
            y: instance.body$.GetLinearVelocity().y
        });
    }
};
class PixiRuntimeVelocity extends runtime_core_1.OgodRuntimeSystemDefault {
    update(delta, state) {
        const fullState = self.store.getState();
        rxjs_1.from(state.entities).pipe(operators_1.map((id) => fullState.instance[id])).subscribe(this.getModifier(state)(delta));
    }
    getModifier(state) {
        let modifier;
        switch (state.modifier) {
            case 'world':
                modifier = worldModifier;
                break;
            case 'physics':
                modifier = physicsModifider;
                break;
            default:
                modifier = defaultModifier;
        }
        return modifier;
    }
}
exports.PixiRuntimeVelocity = PixiRuntimeVelocity;
//# sourceMappingURL=runtime.js.map