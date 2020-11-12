"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pixiHybridSpriteAnimated = void 0;
const element_core_1 = require("@ogod/element-core");
function pixiHybridSpriteAnimated() {
    return {
        animation: element_core_1.ogodFactoryInstanceProperty(''),
        playing: element_core_1.ogodFactoryInstanceProperty(false),
        loop: element_core_1.ogodFactoryInstanceProperty(false),
        duration: element_core_1.ogodFactoryInstanceProperty(1),
        durations: element_core_1.ogodFactoryInstanceProperty(undefined)
    };
}
exports.pixiHybridSpriteAnimated = pixiHybridSpriteAnimated;
//# sourceMappingURL=hybrid.js.map