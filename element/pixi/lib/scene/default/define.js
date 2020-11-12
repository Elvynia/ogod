"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pixiDefineScene = void 0;
const element_core_1 = require("@ogod/element-core");
const hybrid_1 = require("./hybrid");
function pixiDefineScene(tagName, stateHybrids = [], overrideHybrids = []) {
    return element_core_1.ogodDefineScene(tagName || 'pixi-scene', [hybrid_1.pixiHybridScene(), ...stateHybrids], overrideHybrids);
}
exports.pixiDefineScene = pixiDefineScene;
//# sourceMappingURL=define.js.map