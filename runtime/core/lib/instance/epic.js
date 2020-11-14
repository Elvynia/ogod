"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.epicInstanceDestroy = exports.epicInstanceChanges = exports.epicInstanceInit = void 0;
const common_1 = require("@ogod/common");
const redux_observable_1 = require("redux-observable");
const operators_1 = require("rxjs/operators");
const epic_1 = require("../actor/epic");
exports.epicInstanceInit = epic_1.ogodEpicActorInit(common_1.OGOD_CATEGORY.INSTANCE);
exports.epicInstanceChanges = epic_1.ogodEpicActorChanges(common_1.OGOD_CATEGORY.INSTANCE);
exports.epicInstanceDestroy = (actions$, state$) => actions$.pipe(redux_observable_1.ofType(common_1.instanceDestroy.type), operators_1.mergeMap(({ id }) => state$.pipe(operators_1.take(1), operators_1.filter((state) => !!state.instance[id]), operators_1.map((state) => ({
    state: state.instance[id],
    scenes: state.instance[id].scenes.map((sceneId) => state.scene[sceneId]),
    systems: Object.values(state.system)
        .filter((sys) => sys.entities.includes(id))
})))), operators_1.mergeMap(({ state, scenes, systems }) => {
    const runtime = self.runtimes.instance[state.id];
    if (state.running) {
        state.active = false;
        runtime.stop(state);
    }
    for (let system of systems) {
        self.runtimes.system[system.id].remove(system, state.id, state);
    }
    for (let scene of scenes) {
        self.runtimes.scene[scene.id].remove(scene, state.id, state);
    }
    return runtime.destroy(state);
}));
//# sourceMappingURL=epic.js.map