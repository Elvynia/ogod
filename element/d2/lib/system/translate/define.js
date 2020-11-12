"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.d2DefineTranslate = void 0;
const element_core_1 = require("@ogod/element-core");
const hybrid_1 = require("./hybrid");
function d2DefineTranslate(tagName, stateHybrids = [], overrideHybrids = []) {
    return element_core_1.ogodDefineSystem(tagName || 'd2-translate', [hybrid_1.d2HybridTranslate(), ...stateHybrids], overrideHybrids);
}
exports.d2DefineTranslate = d2DefineTranslate;
//# sourceMappingURL=define.js.map