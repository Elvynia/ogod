"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pixiHybridArea = void 0;
const element_core_1 = require("@ogod/element-core");
function pixiHybridArea() {
    return {
        category: 'area',
        minX: element_core_1.ogodFactorySystemProperty(0),
        minY: element_core_1.ogodFactorySystemProperty(0),
        maxX: element_core_1.ogodFactorySystemProperty(1000),
        maxY: element_core_1.ogodFactorySystemProperty(1000)
    };
}
exports.pixiHybridArea = pixiHybridArea;
//# sourceMappingURL=hybrid.js.map