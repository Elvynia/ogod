"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.box2dHybridJump = void 0;
const element_core_1 = require("@ogod/element-core");
function box2dHybridJump() {
    return {
        force: element_core_1.ogodFactorySystemProperty(1),
        physicsId: element_core_1.ogodFactorySystemProperty('')
    };
}
exports.box2dHybridJump = box2dHybridJump;
//# sourceMappingURL=hybrid.js.map