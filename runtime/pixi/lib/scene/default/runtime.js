"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PixiRuntimeScene = void 0;
const operators_1 = require("rxjs/operators");
const runtime_core_1 = require("@ogod/runtime-core");
class PixiRuntimeScene extends runtime_core_1.OgodRuntimeSceneDefault {
    initialize(state, state$) {
        state.container$ = new PIXI.Container();
        if (state.renderer$) {
            return super.initialize(state, state$);
        }
        return state$.pipe(operators_1.skipWhile((engine) => engine.scene[state.id].renderer$ != null), operators_1.map((engine) => engine.scene[state.id]), operators_1.take(1), operators_1.switchMap((initState) => super.initialize(Object.assign(Object.assign({}, state), initState), state$)));
    }
    nextCanvas(state, canvas, lastCanvas) {
        // FIXME: Pixi Worker support.
        canvas.style = {};
        return {
            renderer$: new PIXI.Renderer(Object.assign(Object.assign({}, state.renderer), { view: canvas }))
        };
    }
    add(state, child) {
        state.container$.addChild(child.instance$);
        state.container$.sortChildren();
    }
    remove(state, id, child) {
        if (child && child.instance$) {
            state.container$.removeChild(child.instance$);
        }
        else {
            state.container$.removeChild(state.container$.getChildByName(id));
        }
    }
    render(state) {
        state.renderer$.render(state.container$);
    }
}
exports.PixiRuntimeScene = PixiRuntimeScene;
//# sourceMappingURL=runtime.js.map