"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.box2dHybridShape = void 0;
const element_core_1 = require("@ogod/element-core");
function box2dHybridShape() {
    return {
        category: 'shape',
        x: element_core_1.ogodFactoryInstanceProperty(0),
        y: element_core_1.ogodFactoryInstanceProperty(0)
    };
}
exports.box2dHybridShape = box2dHybridShape;
//# sourceMappingURL=hybrid.js.map