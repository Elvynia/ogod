"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchBaseTexture = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const runtime_core_1 = require("@ogod/runtime-core");
function fetchBaseTexture(path) {
    return rxjs_1.from(runtime_core_1.ogodFetch(path)).pipe(operators_1.switchMap((response) => response.blob()), operators_1.switchMap((blob) => createImageBitmap(blob)), operators_1.map((image) => new PIXI.resources.ImageBitmapResource(image)), operators_1.map((resource) => new PIXI.BaseTexture(resource)));
}
exports.fetchBaseTexture = fetchBaseTexture;
//# sourceMappingURL=runtime.js.map