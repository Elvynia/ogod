"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ogodEpicActorDestroy = exports.ogodEpicActorChanges = exports.ogodEpicActorInit = void 0;
const rxjs_1 = require("rxjs");
const redux_observable_1 = require("redux-observable");
const operators_1 = require("rxjs/operators");
const common_1 = require("@ogod/common");
function ogodEpicActorInit(category, postInit) {
    return (action$, state$) => action$.pipe(redux_observable_1.ofType(common_1.ogodActionName(category, common_1.OGOD_ACTION_ACTOR.INIT)), operators_1.mergeMap(({ state }) => {
        if (self.registry[state.category + '.' + state.runtime]) {
            const runtime = new self.registry[state.category + '.' + state.runtime]();
            Object.assign(self.runtimes[category], { [state.id]: runtime });
            if (postInit) {
                postInit(state, runtime);
            }
            return runtime.initialize(state, state$);
        }
        else {
            console.error('[OGOD][instance] Cannot find runtime %s.%s in registry to initialize.', state.category, state.runtime);
        }
        // FIXME: instanceInitError
        return rxjs_1.empty();
    }));
}
exports.ogodEpicActorInit = ogodEpicActorInit;
function ogodEpicActorChanges(category) {
    return (action$, state$) => action$.pipe(redux_observable_1.ofType(common_1.ogodActionName(category, common_1.OGOD_ACTION_ACTOR.CHANGES)), operators_1.mergeMap(({ id, changes }) => state$.pipe(operators_1.filter((state) => {
        const test = state[category];
        return state[category][id] && state[category][id].loaded;
    }), operators_1.map((state) => ({
        id,
        changes,
        state: state[category][id]
    })), operators_1.take(1))), operators_1.mergeMap(({ id, changes, state }) => {
        const runtime = self.runtimes[category][id];
        return runtime.changes(changes, state);
    }));
}
exports.ogodEpicActorChanges = ogodEpicActorChanges;
function ogodEpicActorDestroy(category) {
    return (actions$, state$) => actions$.pipe(redux_observable_1.ofType(common_1.ogodActionName(category, common_1.OGOD_ACTION_ACTOR.DESTROY)), operators_1.mergeMap(({ id }) => state$.pipe(operators_1.map((state) => state[category][id]), operators_1.take(1))), operators_1.mergeMap((state) => {
        const runtime = self.runtimes[category][state.id];
        return runtime.destroy(state);
    }));
}
exports.ogodEpicActorDestroy = ogodEpicActorDestroy;
//# sourceMappingURL=epic.js.map