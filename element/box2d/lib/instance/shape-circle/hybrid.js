"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.box2dHybridShapeCircle = void 0;
const element_core_1 = require("@ogod/element-core");
const hybrid_1 = require("../shape/hybrid");
function box2dHybridShapeCircle() {
    return Object.assign(Object.assign({}, hybrid_1.box2dHybridShape()), { radius: element_core_1.ogodFactoryInstanceProperty(1), angle: element_core_1.ogodFactoryInstanceProperty(0) });
}
exports.box2dHybridShapeCircle = box2dHybridShapeCircle;
//# sourceMappingURL=hybrid.js.map