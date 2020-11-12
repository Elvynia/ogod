"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.epicResourceDestroy = exports.epicResourceInit = void 0;
const common_1 = require("@ogod/common");
const epic_1 = require("../actor/epic");
exports.epicResourceInit = epic_1.ogodEpicActorInit(common_1.OGOD_CATEGORY.RESOURCE);
exports.epicResourceDestroy = epic_1.ogodEpicActorDestroy(common_1.OGOD_CATEGORY.RESOURCE);
//# sourceMappingURL=epic.js.map