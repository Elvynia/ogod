"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ogodHybridInstance = void 0;
const parent_1 = require("../factory/parent");
function ogodHybridInstance() {
    return {
        scene: parent_1.ogodFactoryParent('scene'),
        scenes: (host) => host.scene ? [host.scene.id] : []
    };
}
exports.ogodHybridInstance = ogodHybridInstance;
//# sourceMappingURL=hybrid.js.map