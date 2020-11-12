"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pixiDefineCamera = void 0;
const element_core_1 = require("@ogod/element-core");
const hybrid_1 = require("./hybrid");
function pixiDefineCamera(tagName, stateHybrids = [], overrideHybrids = []) {
    element_core_1.ogodDefineElement(tagName || 'pixi-camera', hybrid_1.pixiHybridCamera(), stateHybrids, [...overrideHybrids, element_core_1.ogodHybridStateAsync()]);
}
exports.pixiDefineCamera = pixiDefineCamera;
//# sourceMappingURL=define.js.map