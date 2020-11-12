"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.D2RuntimeScene = void 0;
const runtime_core_1 = require("@ogod/runtime-core");
const operators_1 = require("rxjs/operators");
class D2RuntimeScene extends runtime_core_1.OgodRuntimeSceneDefault {
    initialize(state, state$) {
        if (state.context$) {
            return super.initialize(state, state$);
        }
        return state$.pipe(operators_1.filter((fs) => fs.scene[state.id] && fs.scene[state.id].context$ != null), operators_1.take(1), operators_1.map((fs) => (Object.assign(Object.assign({}, state), fs.scene[state.id]))), operators_1.switchMap((initState) => super.initialize(initState, state$)));
    }
    nextCanvas(state, canvas, lastCanvas) {
        return {
            context$: canvas.getContext('2d')
        };
    }
    render(state) {
        if (state.clear) {
            state.context$.clearRect(0, 0, state.context$.canvas.width, state.context$.canvas.height);
        }
        if (state.bgColor) {
            state.context$.fillStyle = state.bgColor;
            state.context$.fillRect(0, 0, state.context$.canvas.width, state.context$.canvas.height);
        }
        const fullState = self.store.getState();
        state.entities
            .map((key) => [key, self.runtimes['instance'][key]])
            .forEach(([key, child]) => child.render(state.context$, fullState.instance[key]));
    }
}
exports.D2RuntimeScene = D2RuntimeScene;
//# sourceMappingURL=runtime.js.map