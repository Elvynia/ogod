"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pixiHybridVelocity = void 0;
const element_core_1 = require("@ogod/element-core");
function pixiHybridVelocity() {
    return {
        modifier: element_core_1.ogodFactorySystemProperty('default', (host) => {
            if (host.modifier === 'physics') {
                host.aspects = ['velocity', 'body'];
            }
            else if (host.modifier === 'world') {
                host.aspects = ['velocity', 'worldX'];
            }
            else {
                host.aspects = ['velocity', 'x'];
            }
            host.mode = 'all';
        })
    };
}
exports.pixiHybridVelocity = pixiHybridVelocity;
//# sourceMappingURL=hybrid.js.map