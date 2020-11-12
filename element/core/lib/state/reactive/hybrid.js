"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ogodHybridStateReactive = void 0;
const state_observable_1 = require("../../factory/state-observable");
const state_1 = require("../../factory/state");
const initialize_1 = require("../../factory/initialize");
function ogodHybridStateReactive(defaultKeys, initCreator, destroyCreator) {
    return {
        initialize$: initialize_1.ogodFactoryInitialize$(),
        state$: state_observable_1.ogodFactoryState$(),
        state: state_1.ogodFactoryState(defaultKeys, initCreator, destroyCreator)
    };
}
exports.ogodHybridStateReactive = ogodHybridStateReactive;
//# sourceMappingURL=hybrid.js.map