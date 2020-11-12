"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.d2HybridRainbow = void 0;
const element_core_1 = require("@ogod/element-core");
function d2HybridRainbow() {
    return {
        colors: element_core_1.ogodFactoryInstanceProperty(['red', 'orange', 'yellow', 'green', 'blue', 'Indigo', 'violet']),
        step: element_core_1.ogodFactoryInstanceProperty(1 / 8),
        x: element_core_1.ogodFactoryInstanceProperty(150),
        y: element_core_1.ogodFactoryInstanceProperty(130),
        width: element_core_1.ogodFactoryInstanceProperty(300),
        height: element_core_1.ogodFactoryInstanceProperty(150),
        index: element_core_1.ogodFactoryInstanceProperty(0),
        time: element_core_1.ogodFactoryInstanceProperty(0),
        tx: element_core_1.ogodFactoryInstanceProperty(0)
    };
}
exports.d2HybridRainbow = d2HybridRainbow;
//# sourceMappingURL=hybrid.js.map