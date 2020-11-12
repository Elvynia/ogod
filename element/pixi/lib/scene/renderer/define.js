"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pixiDefineRenderer = void 0;
const element_core_1 = require("@ogod/element-core");
const hybrid_1 = require("./hybrid");
function pixiDefineRenderer(tagName, stateHybrids = [], overrideHybrids = []) {
    return element_core_1.ogodDefineElement(tagName || 'pixi-renderer', hybrid_1.pixiHybridRenderer(), stateHybrids, [...overrideHybrids, element_core_1.ogodHybridStateAsync()]);
}
exports.pixiDefineRenderer = pixiDefineRenderer;
//# sourceMappingURL=define.js.map