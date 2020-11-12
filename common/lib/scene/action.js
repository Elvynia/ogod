"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sceneDestroyError = exports.sceneDestroySuccess = exports.sceneDestroy = exports.sceneChangesCanvas = exports.sceneChangesError = exports.sceneChangesSuccess = exports.sceneChanges = exports.sceneInitError = exports.sceneInitSuccess = exports.sceneInit = void 0;
const action_1 = require("./../actor/action");
const category_1 = require("../util/category");
const action_2 = require("../util/action");
;
exports.sceneInit = action_1.ogodActionCreatorActor(category_1.OGOD_CATEGORY.SCENE, action_1.OGOD_ACTION_ACTOR.INIT, action_2.ogodActionParams());
exports.sceneInitSuccess = action_1.ogodActionCreatorActor(category_1.OGOD_CATEGORY.SCENE, action_1.OGOD_ACTION_ACTOR.INIT_SUCCESS, action_2.ogodActionParams());
exports.sceneInitError = action_1.ogodActionCreatorActor(category_1.OGOD_CATEGORY.SCENE, action_1.OGOD_ACTION_ACTOR.INIT_ERROR, action_2.ogodActionParams());
exports.sceneChanges = action_1.ogodActionCreatorActor(category_1.OGOD_CATEGORY.SCENE, action_1.OGOD_ACTION_ACTOR.CHANGES, action_2.ogodActionParams());
exports.sceneChangesSuccess = action_1.ogodActionCreatorActor(category_1.OGOD_CATEGORY.SCENE, action_1.OGOD_ACTION_ACTOR.CHANGES_SUCCESS, action_2.ogodActionParams());
exports.sceneChangesError = action_1.ogodActionCreatorActor(category_1.OGOD_CATEGORY.SCENE, action_1.OGOD_ACTION_ACTOR.CHANGES_ERROR, action_2.ogodActionParams());
exports.sceneChangesCanvas = action_2.ogodActionCreator(action_2.ogodActionName(category_1.OGOD_CATEGORY.SCENE, 'CANVAS'), action_2.ogodActionParams());
exports.sceneDestroy = action_1.ogodActionCreatorActor(category_1.OGOD_CATEGORY.SCENE, action_1.OGOD_ACTION_ACTOR.DESTROY, action_2.ogodActionParams());
exports.sceneDestroySuccess = action_1.ogodActionCreatorActor(category_1.OGOD_CATEGORY.SCENE, action_1.OGOD_ACTION_ACTOR.DESTROY_SUCCESS, action_2.ogodActionParams());
exports.sceneDestroyError = action_1.ogodActionCreatorActor(category_1.OGOD_CATEGORY.SCENE, action_1.OGOD_ACTION_ACTOR.DESTROY_ERROR, action_2.ogodActionParams());
//# sourceMappingURL=action.js.map