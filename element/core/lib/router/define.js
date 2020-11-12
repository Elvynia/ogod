"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ogodDefineRouter = void 0;
const hybrids_1 = require("hybrids");
const hybrid_1 = require("./hybrid");
function ogodDefineRouter() {
    return hybrids_1.define('ogod-router', hybrid_1.ogodHybridRouter());
}
exports.ogodDefineRouter = ogodDefineRouter;
//# sourceMappingURL=define.js.map