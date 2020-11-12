"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ogodFetch = void 0;
function ogodFetch(path) {
    return fetch((self.baseHref + path).replace(/\/\//g, '/'));
}
exports.ogodFetch = ogodFetch;
//# sourceMappingURL=fetch.js.map