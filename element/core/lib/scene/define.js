"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ogodDefineScene = void 0;
const define_1 = require("../actor/define");
const hybrid_1 = require("./hybrid");
const constants_1 = require("../constants");
const common_1 = require("@ogod/common");
function ogodDefineScene(tagName = 'ogod-scene', stateHybrids, overrideHybrids) {
    return define_1.ogodDefineActorReactive(tagName, 'scene', hybrid_1.ogodHybridScene(), stateHybrids, overrideHybrids, constants_1.OGOD_DEFAULT_KEYS, common_1.sceneInit, common_1.sceneChanges, common_1.sceneDestroy, false);
}
exports.ogodDefineScene = ogodDefineScene;
//# sourceMappingURL=define.js.map