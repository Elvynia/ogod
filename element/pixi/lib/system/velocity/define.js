"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pixiDefineVelocity = void 0;
const element_core_1 = require("@ogod/element-core");
const hybrid_1 = require("./hybrid");
function pixiDefineVelocity(tagName, stateHybrids = [], overrideHybrids = []) {
    element_core_1.ogodDefineSystem(tagName || 'pixi-velocity', [hybrid_1.pixiHybridVelocity(), ...stateHybrids], [{ runtime: 'velocity' }, ...overrideHybrids]);
}
exports.pixiDefineVelocity = pixiDefineVelocity;
//# sourceMappingURL=define.js.map