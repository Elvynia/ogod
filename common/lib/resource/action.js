"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resourceDestroyError = exports.resourceDestroySuccess = exports.resourceDestroy = exports.resourceInitError = exports.resourceInitSuccess = exports.resourceInit = void 0;
const action_1 = require("./../actor/action");
const category_1 = require("../util/category");
const action_2 = require("../util/action");
;
exports.resourceInit = action_1.ogodActionCreatorActor(category_1.OGOD_CATEGORY.RESOURCE, action_1.OGOD_ACTION_ACTOR.INIT, action_2.ogodActionParams());
exports.resourceInitSuccess = action_1.ogodActionCreatorActor(category_1.OGOD_CATEGORY.RESOURCE, action_1.OGOD_ACTION_ACTOR.INIT_SUCCESS, action_2.ogodActionParams());
exports.resourceInitError = action_1.ogodActionCreatorActor(category_1.OGOD_CATEGORY.RESOURCE, action_1.OGOD_ACTION_ACTOR.INIT_ERROR, action_2.ogodActionParams());
exports.resourceDestroy = action_1.ogodActionCreatorActor(category_1.OGOD_CATEGORY.RESOURCE, action_1.OGOD_ACTION_ACTOR.DESTROY, action_2.ogodActionParams());
exports.resourceDestroySuccess = action_1.ogodActionCreatorActor(category_1.OGOD_CATEGORY.RESOURCE, action_1.OGOD_ACTION_ACTOR.DESTROY_SUCCESS, action_2.ogodActionParams());
exports.resourceDestroyError = action_1.ogodActionCreatorActor(category_1.OGOD_CATEGORY.RESOURCE, action_1.OGOD_ACTION_ACTOR.DESTROY_ERROR, action_2.ogodActionParams());
//# sourceMappingURL=action.js.map