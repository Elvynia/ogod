"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ogodDefineInstanceRef = void 0;
const hybrids_1 = require("hybrids");
const hybrid_1 = require("./hybrid");
function ogodDefineInstanceRef() {
    return hybrids_1.define('ogod-instance-ref', hybrid_1.ogodHybridInstanceRef());
}
exports.ogodDefineInstanceRef = ogodDefineInstanceRef;
//# sourceMappingURL=define.js.map