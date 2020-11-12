"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PixiRuntimeSpriteTiled = void 0;
const operators_1 = require("rxjs/operators");
const runtime_1 = require("../default/runtime");
const runtime_2 = require("../sprite/runtime");
class PixiRuntimeSpriteTiled extends runtime_2.PixiRuntimeSprite {
    initializeSprite(state, state$) {
        return runtime_1.waitForResource(state, state$).pipe(operators_1.map((data) => (Object.assign(Object.assign({}, state), { resource$: data, instance$: new PIXI.TilingSprite(data, state.width, state.height) }))));
    }
    update(delta, state) {
        if (state.speed && state.speed !== 0) {
            state.instance$.tilePosition.x += (state.speed * state.ratio) * delta / 1000;
        }
    }
}
exports.PixiRuntimeSpriteTiled = PixiRuntimeSpriteTiled;
//# sourceMappingURL=runtime.js.map