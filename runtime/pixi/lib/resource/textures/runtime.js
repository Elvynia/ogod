"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PixiRuntimeTextures = void 0;
const runtime_core_1 = require("@ogod/runtime-core");
const rxjs_1 = require("rxjs");
const runtime_1 = require("../default/runtime");
const operators_1 = require("rxjs/operators");
class PixiRuntimeTextures extends runtime_core_1.OgodRuntimeResourceDefault {
    initialize(state, state$) {
        return rxjs_1.forkJoin(state.paths.map((path) => runtime_1.fetchBaseTexture(path))).pipe(operators_1.map((textures) => (Object.assign(Object.assign({}, state), { data$: textures.map((base) => new PIXI.Texture(base)) }))), operators_1.switchMap((initState) => super.initialize(initState, state$)));
    }
}
exports.PixiRuntimeTextures = PixiRuntimeTextures;
//# sourceMappingURL=runtime.js.map