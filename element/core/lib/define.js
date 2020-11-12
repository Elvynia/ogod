"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ogodDefineElement = void 0;
const hybrids_1 = require("hybrids");
function ogodDefineElement(tagName, base, stateHybrids, overrideHybrids) {
    let element = stateHybrids ? stateHybrids.reduce((a, b) => Object.assign(a, b), {}) : {};
    element = Object.assign(Object.assign({}, element), base);
    if (overrideHybrids) {
        overrideHybrids.forEach((overrides) => {
            element = Object.assign(Object.assign({}, element), overrides);
        });
    }
    return hybrids_1.define(tagName, element);
}
exports.ogodDefineElement = ogodDefineElement;
//# sourceMappingURL=define.js.map