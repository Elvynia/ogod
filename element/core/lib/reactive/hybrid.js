"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ogodHybridReactive = void 0;
const property_1 = require("../factory/property");
const array_1 = require("../factory/array");
const boolean_1 = require("../factory/boolean");
function ogodHybridReactive(changesCreator, active = true) {
    return {
        active: boolean_1.ogodFactoryReactiveBoolean(active, changesCreator),
        tick: property_1.ogodFactoryReactiveProperty(false, changesCreator),
        updates: array_1.ogodFactoryReactiveArrayString([], changesCreator),
        reflects: array_1.ogodFactoryReactiveArrayString([], changesCreator)
    };
}
exports.ogodHybridReactive = ogodHybridReactive;
//# sourceMappingURL=hybrid.js.map