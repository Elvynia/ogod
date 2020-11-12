"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.box2dHybridDebug = void 0;
const element_core_1 = require("@ogod/element-core");
function box2dHybridDebug() {
    return {
        draw: element_core_1.ogodFactorySceneBoolean(false),
        physicsId: element_core_1.ogodFactorySceneProperty('')
    };
}
exports.box2dHybridDebug = box2dHybridDebug;
//# sourceMappingURL=hybrid.js.map