"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ogodHybridSystem = void 0;
const property_1 = require("../factory/property");
const array_1 = require("../factory/array");
function ogodHybridSystem() {
    return {
        mode: property_1.ogodFactorySystemProperty('any'),
        aspects: array_1.ogodFactorySystemArrayString()
    };
}
exports.ogodHybridSystem = ogodHybridSystem;
//# sourceMappingURL=hybrid.js.map