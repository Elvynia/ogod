"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.systemDestroyError = exports.systemDestroySuccess = exports.systemDestroy = exports.systemChangesError = exports.systemChangesSuccess = exports.systemChanges = exports.systemInitError = exports.systemInitSuccess = exports.systemInit = void 0;
const category_1 = require("../util/category");
const action_1 = require("../util/action");
const action_2 = require("./../actor/action");
;
exports.systemInit = action_2.ogodActionCreatorActor(category_1.OGOD_CATEGORY.SYSTEM, action_2.OGOD_ACTION_ACTOR.INIT, action_1.ogodActionParams());
exports.systemInitSuccess = action_2.ogodActionCreatorActor(category_1.OGOD_CATEGORY.SYSTEM, action_2.OGOD_ACTION_ACTOR.INIT_SUCCESS, action_1.ogodActionParams());
exports.systemInitError = action_2.ogodActionCreatorActor(category_1.OGOD_CATEGORY.SYSTEM, action_2.OGOD_ACTION_ACTOR.INIT_ERROR, action_1.ogodActionParams());
exports.systemChanges = action_2.ogodActionCreatorActor(category_1.OGOD_CATEGORY.SYSTEM, action_2.OGOD_ACTION_ACTOR.CHANGES, action_1.ogodActionParams());
exports.systemChangesSuccess = action_2.ogodActionCreatorActor(category_1.OGOD_CATEGORY.SYSTEM, action_2.OGOD_ACTION_ACTOR.CHANGES_SUCCESS, action_1.ogodActionParams());
exports.systemChangesError = action_2.ogodActionCreatorActor(category_1.OGOD_CATEGORY.SYSTEM, action_2.OGOD_ACTION_ACTOR.CHANGES_ERROR, action_1.ogodActionParams());
exports.systemDestroy = action_2.ogodActionCreatorActor(category_1.OGOD_CATEGORY.SYSTEM, action_2.OGOD_ACTION_ACTOR.DESTROY, action_1.ogodActionParams());
exports.systemDestroySuccess = action_2.ogodActionCreatorActor(category_1.OGOD_CATEGORY.SYSTEM, action_2.OGOD_ACTION_ACTOR.DESTROY_SUCCESS, action_1.ogodActionParams());
exports.systemDestroyError = action_2.ogodActionCreatorActor(category_1.OGOD_CATEGORY.SYSTEM, action_2.OGOD_ACTION_ACTOR.DESTROY_ERROR, action_1.ogodActionParams());
//# sourceMappingURL=action.js.map