"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pixiDefineTextures = void 0;
const element_core_1 = require("@ogod/element-core");
function pixiDefineTextures(tagName, stateHybrids = [], overrideHybrids = []) {
    element_core_1.ogodDefineResources(tagName || 'pixi-textures', stateHybrids, [{ runtime: 'textures' }, ...overrideHybrids]);
}
exports.pixiDefineTextures = pixiDefineTextures;
//# sourceMappingURL=define.js.map