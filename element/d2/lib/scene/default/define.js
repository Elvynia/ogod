"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.d2DefineScene = void 0;
const element_core_1 = require("@ogod/element-core");
const hybrid_1 = require("./hybrid");
function d2DefineScene(tagName, stateHybrids = [], overrideHybrids = []) {
    return element_core_1.ogodDefineScene(tagName || 'd2-scene', [hybrid_1.d2HybridScene(), ...stateHybrids], overrideHybrids);
}
exports.d2DefineScene = d2DefineScene;
//# sourceMappingURL=define.js.map