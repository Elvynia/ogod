"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.d2DefineShape = void 0;
const element_core_1 = require("@ogod/element-core");
const hybrid_1 = require("./hybrid");
function d2DefineShape(tagName, stateHybrids = [], overrideHybrids = []) {
    return element_core_1.ogodDefineInstance(tagName || 'd2-shape', [hybrid_1.d2HybridShape(), ...stateHybrids], overrideHybrids);
}
exports.d2DefineShape = d2DefineShape;
//# sourceMappingURL=define.js.map