"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pixiHybridCamera = void 0;
const element_core_1 = require("@ogod/element-core");
function pixiHybridCamera() {
    return {
        category: 'camera',
        x: element_core_1.ogodFactorySystemProperty(0),
        y: element_core_1.ogodFactorySystemProperty(0),
        width: element_core_1.ogodFactorySystemProperty(800),
        height: element_core_1.ogodFactorySystemProperty(600),
        worldX: element_core_1.ogodFactorySystemProperty(0),
        worldY: element_core_1.ogodFactorySystemProperty(0),
        offset: element_core_1.ogodFactoryInstanceChildren('area')
    };
}
exports.pixiHybridCamera = pixiHybridCamera;
//# sourceMappingURL=hybrid.js.map