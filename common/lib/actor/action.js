"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ogodActionCreatorActor = exports.OGOD_ACTION_ACTOR = void 0;
const action_1 = require("../util/action");
var OGOD_ACTION_ACTOR;
(function (OGOD_ACTION_ACTOR) {
    OGOD_ACTION_ACTOR["INIT"] = "INIT";
    OGOD_ACTION_ACTOR["INIT_SUCCESS"] = "INIT_SUCCESS";
    OGOD_ACTION_ACTOR["INIT_ERROR"] = "INIT_ERROR";
    OGOD_ACTION_ACTOR["CHANGES"] = "CHANGES";
    OGOD_ACTION_ACTOR["CHANGES_SUCCESS"] = "CHANGES_SUCCESS";
    OGOD_ACTION_ACTOR["CHANGES_ERROR"] = "CHANGES_ERROR";
    OGOD_ACTION_ACTOR["DESTROY"] = "DESTROY";
    OGOD_ACTION_ACTOR["DESTROY_SUCCESS"] = "DESTROY_SUCCESS";
    OGOD_ACTION_ACTOR["DESTROY_ERROR"] = "DESTROY_ERROR";
})(OGOD_ACTION_ACTOR = exports.OGOD_ACTION_ACTOR || (exports.OGOD_ACTION_ACTOR = {}));
function ogodActionCreatorActor(category, action, params) {
    return action_1.ogodActionCreator(action_1.ogodActionName(category, action), params);
}
exports.ogodActionCreatorActor = ogodActionCreatorActor;
//# sourceMappingURL=action.js.map