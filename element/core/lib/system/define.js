"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ogodDefineSystem = void 0;
const define_1 = require("../actor/define");
const hybrid_1 = require("./hybrid");
const constants_1 = require("../constants");
const common_1 = require("@ogod/common");
function ogodDefineSystem(tagName = 'ogod-system', stateHybrids, overrideHybrids) {
    return define_1.ogodDefineActorReactive(tagName, 'system', hybrid_1.ogodHybridSystem(), stateHybrids, overrideHybrids, constants_1.OGOD_DEFAULT_KEYS, common_1.systemInit, common_1.systemChanges, common_1.systemDestroy);
}
exports.ogodDefineSystem = ogodDefineSystem;
//# sourceMappingURL=define.js.map