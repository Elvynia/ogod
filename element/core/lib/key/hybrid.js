"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ogodHybridKey = void 0;
const property_1 = require("../factory/property");
function ogodHybridKey() {
    return {
        category: 'key',
        code: property_1.ogodFactoryInstanceProperty(''),
        keyCode: property_1.ogodFactoryInstanceProperty(-1),
        name: property_1.ogodFactoryInstanceProperty(''),
        pressed: property_1.ogodFactoryInstanceProperty(false)
    };
}
exports.ogodHybridKey = ogodHybridKey;
//# sourceMappingURL=hybrid.js.map