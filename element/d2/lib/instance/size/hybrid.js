"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.d2HybridSizeXY = exports.d2HybridSize = void 0;
const element_core_1 = require("@ogod/element-core");
function d2HybridSize() {
    return {
        size: element_core_1.ogodFactoryInstanceProperty(10)
    };
}
exports.d2HybridSize = d2HybridSize;
function d2HybridSizeXY() {
    return {
        sizeX: element_core_1.ogodFactoryInstanceProperty(10),
        sizeY: element_core_1.ogodFactoryInstanceProperty(30)
    };
}
exports.d2HybridSizeXY = d2HybridSizeXY;
//# sourceMappingURL=hybrid.js.map