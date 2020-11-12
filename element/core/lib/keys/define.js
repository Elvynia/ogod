"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ogodDefineKeys = void 0;
const hybrids_1 = require("hybrids");
const hybrid_1 = require("./hybrid");
const hybrid_2 = require("../state/async/hybrid");
function ogodDefineKeys() {
    return hybrids_1.define('ogod-keys', Object.assign(Object.assign({}, hybrid_1.ogodHybridKeys()), hybrid_2.ogodHybridStateAsync()));
}
exports.ogodDefineKeys = ogodDefineKeys;
//# sourceMappingURL=define.js.map