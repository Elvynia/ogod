"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.box2dDefineShapePoly = void 0;
const element_core_1 = require("@ogod/element-core");
const element_core_2 = require("@ogod/element-core");
const hybrid_1 = require("./hybrid");
function box2dDefineShapePoly(tagName, stateHybrids = [], overrideHybrids = []) {
    element_core_1.ogodDefineElement(tagName || 'box2d-shape-poly', hybrid_1.box2dHybridShapePoly(), stateHybrids, [...overrideHybrids, element_core_2.ogodHybridStateAsync()]);
}
exports.box2dDefineShapePoly = box2dDefineShapePoly;
//# sourceMappingURL=define.js.map