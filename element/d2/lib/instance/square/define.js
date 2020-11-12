"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.d2DefineSquare = void 0;
const element_core_1 = require("@ogod/element-core");
const hybrid_1 = require("../instance/hybrid");
const hybrid_2 = require("../size/hybrid");
function d2DefineSquare(tagName, stateHybrids = [], overrideHybrids = []) {
    return element_core_1.ogodDefineInstance(tagName || 'd2-square', [hybrid_1.d2HybridInstance(), hybrid_2.d2HybridSize(), ...stateHybrids], [...overrideHybrids, {
            runtime: 'square'
        }]);
}
exports.d2DefineSquare = d2DefineSquare;
//# sourceMappingURL=define.js.map