"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instanceDestroyError = exports.instanceDestroySuccess = exports.instanceDestroy = exports.instanceRemove = exports.instanceAdd = exports.instanceChangesError = exports.instanceChangesSuccess = exports.instanceChanges = exports.instanceInitError = exports.instanceInitSuccess = exports.instanceInit = void 0;
const category_1 = require("../util/category");
const action_1 = require("../util/action");
const action_2 = require("./../actor/action");
;
exports.instanceInit = action_2.ogodActionCreatorActor(category_1.OGOD_CATEGORY.INSTANCE, action_2.OGOD_ACTION_ACTOR.INIT, action_1.ogodActionParams());
exports.instanceInitSuccess = action_2.ogodActionCreatorActor(category_1.OGOD_CATEGORY.INSTANCE, action_2.OGOD_ACTION_ACTOR.INIT_SUCCESS, action_1.ogodActionParams());
exports.instanceInitError = action_2.ogodActionCreatorActor(category_1.OGOD_CATEGORY.INSTANCE, action_2.OGOD_ACTION_ACTOR.INIT_ERROR, action_1.ogodActionParams());
exports.instanceChanges = action_2.ogodActionCreatorActor(category_1.OGOD_CATEGORY.INSTANCE, action_2.OGOD_ACTION_ACTOR.CHANGES, action_1.ogodActionParams());
exports.instanceChangesSuccess = action_2.ogodActionCreatorActor(category_1.OGOD_CATEGORY.INSTANCE, action_2.OGOD_ACTION_ACTOR.CHANGES_SUCCESS, action_1.ogodActionParams());
exports.instanceChangesError = action_2.ogodActionCreatorActor(category_1.OGOD_CATEGORY.INSTANCE, action_2.OGOD_ACTION_ACTOR.CHANGES_ERROR, action_1.ogodActionParams());
// FIXME: refactor into container/action
exports.instanceAdd = action_1.ogodActionCreator(action_1.ogodActionName(category_1.OGOD_CATEGORY.INSTANCE, 'ADD'), action_1.ogodActionParams());
exports.instanceRemove = action_1.ogodActionCreator(action_1.ogodActionName(category_1.OGOD_CATEGORY.INSTANCE, 'REMOVE'), action_1.ogodActionParams());
exports.instanceDestroy = action_2.ogodActionCreatorActor(category_1.OGOD_CATEGORY.INSTANCE, action_2.OGOD_ACTION_ACTOR.DESTROY, action_1.ogodActionParams());
exports.instanceDestroySuccess = action_2.ogodActionCreatorActor(category_1.OGOD_CATEGORY.INSTANCE, action_2.OGOD_ACTION_ACTOR.DESTROY_SUCCESS, action_1.ogodActionParams());
exports.instanceDestroyError = action_2.ogodActionCreatorActor(category_1.OGOD_CATEGORY.INSTANCE, action_2.OGOD_ACTION_ACTOR.DESTROY_ERROR, action_1.ogodActionParams());
//# sourceMappingURL=action.js.map