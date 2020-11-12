"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PixiRuntimeSprite = void 0;
const runtime_1 = require("../default/runtime");
const operators_1 = require("rxjs/operators");
class PixiRuntimeSprite extends runtime_1.PixiRuntimeInstance {
    initializeSprite(state, state$) {
        return runtime_1.waitForResource(state, state$).pipe(operators_1.map((data) => (Object.assign(Object.assign({}, state), { resource$: data, instance$: new PIXI.Sprite(data) }))));
    }
    initializeProperties(state) {
        super.initializeProperties(state);
        if (state.anchor != null) {
            this.updateStateAnchor(0, state);
        }
        else {
            this.updateStateAnchorX(0, state);
            this.updateStateAnchorY(0, state);
        }
    }
    updateStateAnchor(_, state) {
        state.anchorX = state.anchor;
        state.anchorY = state.anchor;
        this.updateStateAnchorX(_, state);
        this.updateStateAnchorY(_, state);
    }
    updateStateAnchorX(_, state) {
        state.instance$.anchor.x = state.anchorX;
    }
    updateStateAnchorY(_, state) {
        state.instance$.anchor.y = state.anchorY;
    }
}
exports.PixiRuntimeSprite = PixiRuntimeSprite;
//# sourceMappingURL=runtime.js.map