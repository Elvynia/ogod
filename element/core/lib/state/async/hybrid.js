"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ogodHybridStateAsync = void 0;
const initialize_1 = require("../../factory/initialize");
function ogodHybridStateAsync(connect) {
    return {
        initialize$: initialize_1.ogodFactoryInitialize$(),
        state: {
            get: () => ({}),
            connect
        }
    };
}
exports.ogodHybridStateAsync = ogodHybridStateAsync;
//# sourceMappingURL=hybrid.js.map