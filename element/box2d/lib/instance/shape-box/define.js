"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.box2dDefineShapeBox = void 0;
const element_core_1 = require("@ogod/element-core");
const element_core_2 = require("@ogod/element-core");
const hybrid_1 = require("./hybrid");
function box2dDefineShapeBox(tagName, stateHybrids = [], overrideHybrids = []) {
    element_core_1.ogodDefineElement(tagName || 'box2d-shape-box', hybrid_1.box2dHybridShapeBox(), stateHybrids, [...overrideHybrids, element_core_2.ogodHybridStateAsync()]);
}
exports.box2dDefineShapeBox = box2dDefineShapeBox;
//# sourceMappingURL=define.js.map