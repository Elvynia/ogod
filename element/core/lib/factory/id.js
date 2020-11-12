"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ogodFactoryId = void 0;
const hybrids_1 = require("hybrids");
exports.ogodFactoryId = () => hybrids_1.property('', (host) => {
    // FIXME: connect too late for state properties defined before, use getter ?
    if (!host.id) {
        host.id = 'ogod-' + host.category + '-' + host.runtime;
    }
});
//# sourceMappingURL=id.js.map