"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pixiDefineSprite = void 0;
const element_core_1 = require("@ogod/element-core");
const hybrid_1 = require("../default/hybrid");
const hybrid_2 = require("./hybrid");
function pixiDefineSprite(tagName, stateHybrids = [], overrideHybrids = []) {
    return element_core_1.ogodDefineInstance(tagName || 'pixi-sprite', [hybrid_1.pixiHybridInstance(), hybrid_2.pixiHybridSprite(), ...stateHybrids], [{ runtime: 'sprite' }, ...overrideHybrids]);
}
exports.pixiDefineSprite = pixiDefineSprite;
//# sourceMappingURL=define.js.map