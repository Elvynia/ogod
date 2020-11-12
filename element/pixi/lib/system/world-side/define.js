"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pixiDefineWorldSide = void 0;
const element_core_1 = require("@ogod/element-core");
const hybrid_1 = require("../world/hybrid");
const hybrid_2 = require("./hybrid");
function pixiDefineWorldSide(tagName, stateHybrids = [], overrideHybrids = []) {
    element_core_1.ogodDefineSystem(tagName || 'pixi-world-side', [hybrid_1.pixiHybridWorld(), hybrid_2.pixiHybridWorldSide(), ...stateHybrids], [{ runtime: 'world-side' }, ...overrideHybrids]);
}
exports.pixiDefineWorldSide = pixiDefineWorldSide;
//# sourceMappingURL=define.js.map