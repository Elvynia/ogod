"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ogodReducers = void 0;
const reducer_1 = require("./system/reducer");
const reducer_2 = require("./scene/reducer");
const reducer_3 = require("./instance/reducer");
const reducer_4 = require("./resource/reducer");
exports.ogodReducers = {
    system: reducer_1.ogodReducerSystem(),
    scene: reducer_2.ogodReducerScene(),
    instance: reducer_3.ogodReducerInstance(),
    resource: reducer_4.ogodReducerResource()
};
//# sourceMappingURL=reducers.js.map