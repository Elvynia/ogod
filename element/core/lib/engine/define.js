"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ogodDefineEngine = void 0;
const define_1 = require("../define");
const hybrid_1 = require("./hybrid");
function ogodDefineEngine(tagName, stateHybrids, overrideHybrids) {
    return define_1.ogodDefineElement(tagName || 'ogod-engine', hybrid_1.ogodHybridEngine(), stateHybrids, overrideHybrids);
}
exports.ogodDefineEngine = ogodDefineEngine;
//# sourceMappingURL=define.js.map