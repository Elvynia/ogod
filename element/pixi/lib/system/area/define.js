"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pixiDefineArea = void 0;
const element_core_1 = require("@ogod/element-core");
const hybrid_1 = require("./hybrid");
function pixiDefineArea(tagName, stateHybrids = [], overrideHybrids = []) {
    element_core_1.ogodDefineElement(tagName || 'pixi-area', hybrid_1.pixiHybridArea(), stateHybrids, [...overrideHybrids, element_core_1.ogodHybridStateAsync()]);
}
exports.pixiDefineArea = pixiDefineArea;
//# sourceMappingURL=define.js.map