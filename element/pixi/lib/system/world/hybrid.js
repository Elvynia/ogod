"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pixiHybridWorld = void 0;
const hybrids_1 = require("hybrids");
const element_core_1 = require("@ogod/element-core");
function pixiHybridWorld() {
    return {
        follow: element_core_1.ogodFactoryInstanceProperty(''),
        bounds: element_core_1.ogodFactoryInstanceChildren('area'),
        camera: element_core_1.ogodFactoryInstanceChildren('camera'),
        render: () => hybrids_1.html `<slot></slot>`
    };
}
exports.pixiHybridWorld = pixiHybridWorld;
//# sourceMappingURL=hybrid.js.map