"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.box2dDefineShapeCircle = void 0;
const element_core_1 = require("@ogod/element-core");
const element_core_2 = require("@ogod/element-core");
const hybrid_1 = require("./hybrid");
function box2dDefineShapeCircle(tagName, stateHybrids = [], overrideHybrids = []) {
    element_core_1.ogodDefineElement(tagName || 'box2d-shape-circle', hybrid_1.box2dHybridShapeCircle(), stateHybrids, [...overrideHybrids, element_core_2.ogodHybridStateAsync()]);
}
exports.box2dDefineShapeCircle = box2dDefineShapeCircle;
//# sourceMappingURL=define.js.map