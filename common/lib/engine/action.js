"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.engineDestroy = exports.engineReflectUpdates = exports.engineReflectChanges = exports.engineCanvas = exports.engineStop = exports.engineStart = exports.engineInit = void 0;
const action_1 = require("../actor/action");
const action_2 = require("../util/action");
exports.engineInit = action_1.ogodActionCreatorActor('engine', action_1.OGOD_ACTION_ACTOR.INIT, action_2.ogodActionParams());
// export const engineInitSuccess = ogodActionCreatorActor('engine', OGOD_ACTION_ACTOR.INIT_SUCCESS);
// export const engineInitError = ogodActionCreatorActor('engine', OGOD_ACTION_ACTOR.INIT_ERROR);
exports.engineStart = action_2.ogodActionCreator(action_2.ogodActionName('engine', 'START'));
exports.engineStop = action_2.ogodActionCreator(action_2.ogodActionName('engine', 'STOP'));
exports.engineCanvas = action_2.ogodActionCreator(action_2.ogodActionName('engine', 'CANVAS'));
exports.engineReflectChanges = action_2.ogodActionCreator(action_2.ogodActionName('engine', 'REFLECT_CHANGES'), action_2.ogodActionParams());
exports.engineReflectUpdates = action_2.ogodActionCreator(action_2.ogodActionName('engine', 'REFLECT_UPDATES'), action_2.ogodActionParams());
exports.engineDestroy = action_1.ogodActionCreatorActor('engine', action_1.OGOD_ACTION_ACTOR.DESTROY);
// export const engineDestroySuccess = ogodActionCreatorActor('engine', OGOD_ACTION_ACTOR.DESTROY_SUCCESS);
// export const engineDestroyError = ogodActionCreatorActor('engine', OGOD_ACTION_ACTOR.DESTROY_ERROR);
//# sourceMappingURL=action.js.map