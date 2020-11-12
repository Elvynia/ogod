"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.box2dHybridBody = void 0;
const element_core_1 = require("@ogod/element-core");
function box2dHybridBody() {
    return {
        category: 'body',
        x: element_core_1.ogodFactoryInstanceProperty(0),
        y: element_core_1.ogodFactoryInstanceProperty(0),
        dynamic: element_core_1.ogodFactoryInstanceProperty(false),
        density: element_core_1.ogodFactoryInstanceProperty(1),
        friction: element_core_1.ogodFactoryInstanceProperty(0),
        restitution: element_core_1.ogodFactoryInstanceProperty(0),
        shape: element_core_1.ogodFactoryInstanceChildren('shape')
    };
}
exports.box2dHybridBody = box2dHybridBody;
//# sourceMappingURL=hybrid.js.map