"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ogodHybridActor = void 0;
const hybrids_1 = require("hybrids");
const parent_1 = require("../factory/parent");
const id_1 = require("./../factory/id");
function ogodHybridActor(category) {
    return {
        category,
        runtime: hybrids_1.property('default'),
        id: id_1.ogodFactoryId(),
        engine: parent_1.ogodFactoryParent('engine')
    };
}
exports.ogodHybridActor = ogodHybridActor;
//# sourceMappingURL=hybrid.js.map