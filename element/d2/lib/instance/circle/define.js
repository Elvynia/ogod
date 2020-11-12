"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.d2DefineCircle = void 0;
const element_core_1 = require("@ogod/element-core");
const hybrid_1 = require("../instance/hybrid");
const hybrid_2 = require("../size/hybrid");
function d2DefineCircle(tagName, stateHybrids = [], overrideHybrids = []) {
    return element_core_1.ogodDefineInstance(tagName || 'd2-circle', [hybrid_1.d2HybridInstance(), hybrid_2.d2HybridSize(), ...stateHybrids], [...overrideHybrids, {
            runtime: 'circle'
        }]);
}
exports.d2DefineCircle = d2DefineCircle;
//# sourceMappingURL=define.js.map