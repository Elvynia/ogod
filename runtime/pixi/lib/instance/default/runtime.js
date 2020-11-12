"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PixiRuntimeInstance = exports.waitForResource = void 0;
const runtime_core_1 = require("@ogod/runtime-core");
const operators_1 = require("rxjs/operators");
function waitForResource(state, state$) {
    return state$.pipe(operators_1.filter((engine) => engine.resource[state.resource] && engine.resource[state.resource].loaded), operators_1.map((engine) => engine.resource[state.resource]), operators_1.take(1), operators_1.pluck('data$'));
}
exports.waitForResource = waitForResource;
class PixiRuntimeInstance extends runtime_core_1.OgodRuntimeInstanceDefault {
    initialize(state, state$) {
        return this.initializeSprite(state, state$).pipe(operators_1.tap((initState) => this.initializeProperties(initState)), operators_1.switchMap((initState) => super.initialize(initState, state$)));
    }
    initializeProperties(state) {
        state.instance$.name = state.id;
        this.updateStateX(0, state);
        this.updateStateY(0, state);
        this.updateStateRotation(0, state);
        this.updateStateIndex(0, state);
        if (state.scale != null) {
            this.updateStateScale(0, state);
        }
        else {
            this.updateStateScaleX(0, state);
            this.updateStateScaleY(0, state);
        }
    }
    updateStateX(_, state) {
        state.instance$.position.x = state.x;
    }
    updateStateY(_, state) {
        state.instance$.position.y = state.y;
    }
    updateStateRotation(_, state) {
        state.instance$.rotation = state.rotation;
    }
    updateStateScale(_, state) {
        state.scaleX = state.scale;
        state.scaleY = state.scale;
        this.updateStateScaleX(_, state);
        this.updateStateScaleY(_, state);
    }
    updateStateScaleX(_, state) {
        state.instance$.scale.x = state.scaleX;
    }
    updateStateScaleY(_, state) {
        state.instance$.scale.y = state.scaleY;
    }
    updateStateIndex(_, state) {
        state.instance$.zIndex = state.index;
    }
    destroy(state) {
        // FIXME: Options for children/textures ?
        state.instance$.destroy();
        return super.destroy(state);
    }
}
exports.PixiRuntimeInstance = PixiRuntimeInstance;
//# sourceMappingURL=runtime.js.map