"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pixiDefineWorld = void 0;
const element_core_1 = require("@ogod/element-core");
const hybrid_1 = require("./hybrid");
function pixiDefineWorld(tagName, stateHybrids = [], overrideHybrids = []) {
    element_core_1.ogodDefineSystem(tagName || 'pixi-world', [hybrid_1.pixiHybridWorld(), ...stateHybrids], [{ runtime: 'world' }, ...overrideHybrids]);
}
exports.pixiDefineWorld = pixiDefineWorld;
//# sourceMappingURL=define.js.map