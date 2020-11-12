"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.box2dDefinePhysics = void 0;
const element_core_1 = require("@ogod/element-core");
const hybrid_1 = require("./hybrid");
function box2dDefinePhysics(tagName, stateHybrids = [], overrideHybrids = []) {
    element_core_1.ogodDefineSystem(tagName || 'box2d-physics', [hybrid_1.box2dHybridPhysics(), ...stateHybrids], [...overrideHybrids, { runtime: 'physics', aspects: element_core_1.ogodFactorySystemArrayString(['body']) }]);
}
exports.box2dDefinePhysics = box2dDefinePhysics;
//# sourceMappingURL=define.js.map