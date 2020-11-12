"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.box2dDefineJump = void 0;
const element_core_1 = require("@ogod/element-core");
const hybrid_1 = require("./hybrid");
function box2dDefineJump(tagName, stateHybrids = [], overrideHybrids = []) {
    element_core_1.ogodDefineSystem(tagName || 'box2d-jump', [hybrid_1.box2dHybridJump(), ...stateHybrids], overrideHybrids);
}
exports.box2dDefineJump = box2dDefineJump;
//# sourceMappingURL=define.js.map