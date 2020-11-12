"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pixiDefineSpriteCompass = void 0;
const element_core_1 = require("@ogod/element-core");
const hybrid_1 = require("../default/hybrid");
const hybrid_2 = require("../sprite/hybrid");
const hybrid_3 = require("../sprite-animated/hybrid");
const hybrid_4 = require("./hybrid");
function pixiDefineSpriteCompass(tagName, stateHybrids = [], overrideHybrids = []) {
    return element_core_1.ogodDefineInstance(tagName || 'pixi-sprite-compass', [hybrid_1.pixiHybridInstance(), hybrid_2.pixiHybridSprite(), hybrid_3.pixiHybridSpriteAnimated(), hybrid_4.pixiHybridSpriteCompass(), ...stateHybrids], [{ runtime: 'sprite-compass' }, ...overrideHybrids]);
}
exports.pixiDefineSpriteCompass = pixiDefineSpriteCompass;
//# sourceMappingURL=define.js.map