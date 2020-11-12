"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PixiRuntimeParallax = void 0;
const operators_1 = require("rxjs/operators");
const runtime_1 = require("../default/runtime");
class PixiRuntimeParallax extends runtime_1.PixiRuntimeInstance {
    initializeSprite(state, state$) {
        return runtime_1.waitForResource(state, state$).pipe(operators_1.map((textures) => (Object.assign(Object.assign({}, state), { resource$: textures, instance$: new PIXI.Container() }))), operators_1.tap((initState) => initState.resource$
            .map((texture) => new PIXI.TilingSprite(texture, initState.width, initState.height))
            .forEach((sprite, i) => initState.instance$.addChildAt(sprite, i))));
    }
    update(delta, state) {
        if (state.speed && state.speed !== 0) {
            state.instance$.children.slice().reverse().forEach((child, i) => {
                child.tilePosition.x += ((state.speed * state.ratio) / (i + state.speedFactor)) * delta / 1000;
            });
        }
    }
    destroy(state) {
        // FIXME: Options for children/textures.
        state.instance$.destroy();
        return super.destroy(state);
    }
}
exports.PixiRuntimeParallax = PixiRuntimeParallax;
//# sourceMappingURL=runtime.js.map