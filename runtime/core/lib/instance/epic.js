"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.epicInstanceDestroy = exports.epicInstanceChanges = exports.epicInstanceInit = void 0;
const common_1 = require("@ogod/common");
const epic_1 = require("../actor/epic");
exports.epicInstanceInit = epic_1.ogodEpicActorInit(common_1.OGOD_CATEGORY.INSTANCE);
exports.epicInstanceChanges = epic_1.ogodEpicActorChanges(common_1.OGOD_CATEGORY.INSTANCE);
exports.epicInstanceDestroy = epic_1.ogodEpicActorDestroy(common_1.OGOD_CATEGORY.INSTANCE);
//# sourceMappingURL=epic.js.map