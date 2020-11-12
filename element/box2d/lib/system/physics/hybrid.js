"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.box2dHybridPhysics = void 0;
const element_core_1 = require("@ogod/element-core");
function box2dHybridPhysics() {
    return {
        gravityX: element_core_1.ogodFactorySystemProperty(0),
        gravityY: element_core_1.ogodFactorySystemProperty(0)
    };
}
exports.box2dHybridPhysics = box2dHybridPhysics;
//# sourceMappingURL=hybrid.js.map