"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pixiHybridRenderer = void 0;
const element_core_1 = require("@ogod/element-core");
function pixiHybridRenderer() {
    return {
        category: 'renderer',
        transparent: element_core_1.ogodFactorySceneProperty(false),
        width: element_core_1.ogodFactorySceneProperty(800),
        height: element_core_1.ogodFactorySceneProperty(600),
        autoDensity: element_core_1.ogodFactorySceneProperty(false),
        antialias: element_core_1.ogodFactorySceneProperty(false),
        resolution: element_core_1.ogodFactorySceneProperty(1),
        clearBeforeRender: element_core_1.ogodFactorySceneProperty(true),
        preserveDrawingBuffer: element_core_1.ogodFactorySceneProperty(false),
        backgroundColor: element_core_1.ogodFactorySceneProperty(0xdadada),
        powerPreference: element_core_1.ogodFactorySceneProperty(undefined)
    };
}
exports.pixiHybridRenderer = pixiHybridRenderer;
//# sourceMappingURL=hybrid.js.map