"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ogodDefineActorAsync = exports.ogodDefineActorReactive = void 0;
const define_1 = require("../define");
const hybrid_1 = require("../state/async/hybrid");
const hybrid_2 = require("../state/reactive/hybrid");
const hybrid_3 = require("../reactive/hybrid");
const hybrid_4 = require("./hybrid");
function ogodDefineActorReactive(tagName, category, baseHybrid, stateHybrids = [], overrideHybrids = [], defaultKeys, initCreator, changesCreator, destroyCreator, active = true) {
    return define_1.ogodDefineElement(tagName, baseHybrid, changesCreator ? [hybrid_4.ogodHybridActor(category), ...stateHybrids, hybrid_3.ogodHybridReactive(changesCreator, active)] : stateHybrids, [...overrideHybrids, hybrid_2.ogodHybridStateReactive(defaultKeys, initCreator, destroyCreator)]);
}
exports.ogodDefineActorReactive = ogodDefineActorReactive;
function ogodDefineActorAsync(tagName, baseHybrid, stateHybrids = [], overrideHybrids = []) {
    return define_1.ogodDefineElement(tagName, baseHybrid, stateHybrids, [...overrideHybrids, hybrid_1.ogodHybridStateAsync()]);
}
exports.ogodDefineActorAsync = ogodDefineActorAsync;
//# sourceMappingURL=define.js.map