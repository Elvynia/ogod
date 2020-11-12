"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.d2DefineRainbow = void 0;
const element_core_1 = require("@ogod/element-core");
const hybrid_1 = require("./hybrid");
function d2DefineRainbow(tagName, stateHybrids = [], overrideHybrids = []) {
    return element_core_1.ogodDefineInstance(tagName || 'd2-rainbow', [hybrid_1.d2HybridRainbow(), ...stateHybrids], [...overrideHybrids, {
            runtime: 'rainbow'
        }]);
}
exports.d2DefineRainbow = d2DefineRainbow;
//# sourceMappingURL=define.js.map