"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ogodDefineResources = exports.ogodDefineResource = void 0;
const define_1 = require("../actor/define");
const hybrid_1 = require("./hybrid");
const constants_1 = require("../constants");
const common_1 = require("@ogod/common");
function ogodDefineResource(tagName = 'ogod-resource', stateHybrids, overrideHybrids) {
    return define_1.ogodDefineActorReactive(tagName, 'resource', hybrid_1.ogodHybridResource(), stateHybrids, overrideHybrids, constants_1.OGOD_DEFAULT_KEYS.concat(['path']), common_1.resourceInit, null, common_1.resourceDestroy);
}
exports.ogodDefineResource = ogodDefineResource;
function ogodDefineResources(tagName = 'ogod-resources', stateHybrids, overrideHybrids) {
    return define_1.ogodDefineActorReactive(tagName, 'resource', hybrid_1.ogodHybridResources(), stateHybrids, overrideHybrids, constants_1.OGOD_DEFAULT_KEYS.concat(['paths']), common_1.resourceInit, null, common_1.resourceDestroy);
}
exports.ogodDefineResources = ogodDefineResources;
//# sourceMappingURL=define.js.map