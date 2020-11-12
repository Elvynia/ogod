"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PixiRuntimeSpritesheet = void 0;
const runtime_core_1 = require("@ogod/runtime-core");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const runtime_1 = require("../default/runtime");
class PixiRuntimeSpritesheet extends runtime_core_1.OgodRuntimeResourceDefault {
    initialize(state, state$) {
        return rxjs_1.from(runtime_core_1.ogodFetch(state.path)).pipe(operators_1.switchMap((response) => response.json()), operators_1.switchMap((data) => runtime_1.fetchBaseTexture(this.getImageUrl(state.path, data.meta.image)).pipe(operators_1.map((base) => new PIXI.Spritesheet(base, data)), operators_1.switchMap((sheet) => new rxjs_1.Observable((observer) => {
            sheet.parse(() => {
                observer.next(sheet);
                observer.complete();
            });
        })), operators_1.map((sheet) => (Object.assign(Object.assign({}, state), { data$: sheet }))))), operators_1.switchMap((initState) => super.initialize(initState, state$)));
    }
    getImageUrl(path, name) {
        return path.substring(0, path.lastIndexOf('/') + 1) + name;
    }
}
exports.PixiRuntimeSpritesheet = PixiRuntimeSpritesheet;
//# sourceMappingURL=runtime.js.map