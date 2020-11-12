"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pixiDefineParallax = void 0;
const element_core_1 = require("@ogod/element-core");
const hybrid_1 = require("../default/hybrid");
const hybrid_2 = require("../sprite/hybrid");
const hybrid_3 = require("./hybrid");
function pixiDefineParallax(tagName, stateHybrids = [], overrideHybrids = []) {
    return element_core_1.ogodDefineInstance(tagName || 'pixi-parallax', [hybrid_1.pixiHybridInstance(), hybrid_2.pixiHybridSprite(), hybrid_3.pixiHybridParallax(), ...stateHybrids], [{ runtime: 'parallax' }, ...overrideHybrids]);
}
exports.pixiDefineParallax = pixiDefineParallax;
//# sourceMappingURL=define.js.map