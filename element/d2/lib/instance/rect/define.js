"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.d2DefineRect = void 0;
const element_core_1 = require("@ogod/element-core");
const hybrid_1 = require("../instance/hybrid");
const hybrid_2 = require("../size/hybrid");
function d2DefineRect(tagName, stateHybrids = [], overrideHybrids = []) {
    return element_core_1.ogodDefineInstance(tagName || 'd2-rect', [hybrid_1.d2HybridInstance(), hybrid_2.d2HybridSizeXY(), ...stateHybrids], [...overrideHybrids, {
            runtime: 'rect'
        }]);
}
exports.d2DefineRect = d2DefineRect;
//# sourceMappingURL=define.js.map