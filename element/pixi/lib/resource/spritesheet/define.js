"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pixiDefineSpritesheet = void 0;
const element_core_1 = require("@ogod/element-core");
function pixiDefineSpritesheet(tagName, stateHybrids = [], overrideHybrids = []) {
    element_core_1.ogodDefineResource(tagName || 'pixi-spritesheet', stateHybrids, [{ runtime: 'spritesheet' }, ...overrideHybrids]);
}
exports.pixiDefineSpritesheet = pixiDefineSpritesheet;
//# sourceMappingURL=define.js.map