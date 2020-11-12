"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ogodDefineInstance = void 0;
const define_1 = require("../actor/define");
const hybrid_1 = require("./hybrid");
const constants_1 = require("../constants");
const common_1 = require("@ogod/common");
function ogodDefineInstance(tagName = 'ogod-instance', stateHybrids, overrideHybrids) {
    return define_1.ogodDefineActorReactive(tagName, 'instance', hybrid_1.ogodHybridInstance(), stateHybrids, overrideHybrids, constants_1.OGOD_DEFAULT_KEYS.concat('scenes'), common_1.instanceInit, common_1.instanceChanges, common_1.instanceDestroy);
}
exports.ogodDefineInstance = ogodDefineInstance;
//# sourceMappingURL=define.js.map