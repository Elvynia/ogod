"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pixiHybridInstance = void 0;
const element_core_1 = require("@ogod/element-core");
function pixiHybridInstance() {
    return {
        x: element_core_1.ogodFactoryInstanceProperty(0),
        y: element_core_1.ogodFactoryInstanceProperty(0),
        scaleX: element_core_1.ogodFactoryInstanceProperty(1),
        scaleY: element_core_1.ogodFactoryInstanceProperty(1),
        rotation: element_core_1.ogodFactoryInstanceProperty(0),
        index: element_core_1.ogodFactoryInstanceProperty(0),
        resource: element_core_1.ogodFactoryInstanceProperty('')
    };
}
exports.pixiHybridInstance = pixiHybridInstance;
//# sourceMappingURL=hybrid.js.map