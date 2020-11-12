"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pixiDefineTexture = void 0;
const element_core_1 = require("@ogod/element-core");
function pixiDefineTexture(tagName, stateHybrids = [], overrideHybrids = []) {
    element_core_1.ogodDefineResource(tagName || 'pixi-texture', stateHybrids, [{ runtime: 'texture' }, ...overrideHybrids]);
}
exports.pixiDefineTexture = pixiDefineTexture;
//# sourceMappingURL=define.js.map