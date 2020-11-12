"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PixiRuntimeTexture = void 0;
const runtime_core_1 = require("@ogod/runtime-core");
const runtime_1 = require("../default/runtime");
const operators_1 = require("rxjs/operators");
class PixiRuntimeTexture extends runtime_core_1.OgodRuntimeResourceDefault {
    initialize(state, state$) {
        return runtime_1.fetchBaseTexture(state.path).pipe(operators_1.map((base) => new PIXI.Texture(base)), operators_1.map((texture) => (Object.assign(Object.assign({}, state), { data$: texture }))), operators_1.switchMap((initState) => super.initialize(initState, state$)));
    }
}
exports.PixiRuntimeTexture = PixiRuntimeTexture;
//# sourceMappingURL=runtime.js.map