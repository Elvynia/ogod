"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.box2dHybridShapeBox = void 0;
const element_core_1 = require("@ogod/element-core");
const hybrid_1 = require("../shape/hybrid");
function box2dHybridShapeBox() {
    return Object.assign(Object.assign({}, hybrid_1.box2dHybridShape()), { centerX: element_core_1.ogodFactoryInstanceProperty(0), centerY: element_core_1.ogodFactoryInstanceProperty(0), angle: element_core_1.ogodFactoryInstanceProperty(0) });
}
exports.box2dHybridShapeBox = box2dHybridShapeBox;
//# sourceMappingURL=hybrid.js.map