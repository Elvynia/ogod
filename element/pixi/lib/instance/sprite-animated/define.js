"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pixiDefineSpriteAnimated = void 0;
const element_core_1 = require("@ogod/element-core");
const hybrid_1 = require("../default/hybrid");
const hybrid_2 = require("../sprite/hybrid");
const hybrid_3 = require("./hybrid");
function pixiDefineSpriteAnimated(tagName, stateHybrids = [], overrideHybrids = []) {
    return element_core_1.ogodDefineInstance(tagName || 'pixi-sprite-animated', [hybrid_1.pixiHybridInstance(), hybrid_2.pixiHybridSprite(), hybrid_3.pixiHybridSpriteAnimated(), ...stateHybrids], [{ runtime: 'sprite-animated' }, ...overrideHybrids]);
}
exports.pixiDefineSpriteAnimated = pixiDefineSpriteAnimated;
//# sourceMappingURL=define.js.map