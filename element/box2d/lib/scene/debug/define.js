"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.box2dDefineDebug = void 0;
const element_core_1 = require("@ogod/element-core");
const hybrid_1 = require("./hybrid");
function box2dDefineDebug(tagName, stateHybrids = [], overrideHybrids = []) {
    return element_core_1.ogodDefineScene(tagName || 'box2d-debug', [hybrid_1.box2dHybridDebug(), ...stateHybrids], [...overrideHybrids, { runtime: 'box2d-debug' }]);
}
exports.box2dDefineDebug = box2dDefineDebug;
//# sourceMappingURL=define.js.map