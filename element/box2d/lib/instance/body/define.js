"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.box2dDefineBody = void 0;
const element_core_1 = require("@ogod/element-core");
const hybrid_1 = require("./hybrid");
function box2dDefineBody(tagName, stateHybrids = [], overrideHybrids = []) {
    element_core_1.ogodDefineElement(tagName || 'box2d-body', hybrid_1.box2dHybridBody(), stateHybrids, [...overrideHybrids, element_core_1.ogodHybridStateAsync()]);
}
exports.box2dDefineBody = box2dDefineBody;
//# sourceMappingURL=define.js.map