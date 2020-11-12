"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.d2HybridInstance = void 0;
const element_core_1 = require("@ogod/element-core");
function d2HybridInstance() {
    return {
        x: element_core_1.ogodFactoryInstanceProperty(0),
        y: element_core_1.ogodFactoryInstanceProperty(0),
        color: element_core_1.ogodFactoryInstanceProperty('black'),
        tx: element_core_1.ogodFactoryInstanceProperty(0),
        ty: element_core_1.ogodFactoryInstanceProperty(0),
        angle: element_core_1.ogodFactoryInstanceProperty(0)
    };
}
exports.d2HybridInstance = d2HybridInstance;
;
//# sourceMappingURL=hybrid.js.map