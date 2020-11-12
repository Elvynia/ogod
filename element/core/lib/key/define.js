"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ogodDefineKey = void 0;
const hybrids_1 = require("hybrids");
const hybrid_1 = require("./hybrid");
const hybrid_2 = require("../state/async/hybrid");
function ogodDefineKey() {
    return hybrids_1.define('ogod-key', Object.assign(Object.assign({}, hybrid_1.ogodHybridKey()), hybrid_2.ogodHybridStateAsync()));
}
exports.ogodDefineKey = ogodDefineKey;
//# sourceMappingURL=define.js.map