"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.epicSystemDestroy = exports.epicSystemChanges = exports.epicSystemInit = void 0;
const common_1 = require("@ogod/common");
const epic_1 = require("../actor/epic");
exports.epicSystemInit = epic_1.ogodEpicActorInit(common_1.OGOD_CATEGORY.SYSTEM);
exports.epicSystemChanges = epic_1.ogodEpicActorChanges(common_1.OGOD_CATEGORY.SYSTEM);
exports.epicSystemDestroy = epic_1.ogodEpicActorDestroy(common_1.OGOD_CATEGORY.SYSTEM);
//# sourceMappingURL=epic.js.map