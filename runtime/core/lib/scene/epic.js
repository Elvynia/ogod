"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.epicSceneDestroy = exports.epicSceneChanges = exports.epicSceneInit = void 0;
const common_1 = require("@ogod/common");
const epic_1 = require("../actor/epic");
exports.epicSceneInit = epic_1.ogodEpicActorInit(common_1.OGOD_CATEGORY.SCENE, (state, runtime) => {
    if (self.canvas) {
        const changes = runtime.nextCanvas(state, self.canvas, undefined);
        if (changes && Object.keys(changes).length) {
            Object.assign(state, changes);
        }
    }
});
exports.epicSceneChanges = epic_1.ogodEpicActorChanges(common_1.OGOD_CATEGORY.SCENE);
exports.epicSceneDestroy = epic_1.ogodEpicActorDestroy(common_1.OGOD_CATEGORY.SCENE);
//# sourceMappingURL=epic.js.map