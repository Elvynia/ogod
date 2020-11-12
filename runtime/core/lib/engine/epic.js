"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.epicEngineReflectChanges = exports.epicDebugActions = exports.removeTransients = void 0;
const redux_observable_1 = require("redux-observable");
const common_1 = require("@ogod/common");
const operators_1 = require("rxjs/operators");
const rxjs_1 = require("rxjs");
function removeTransients(state) {
    return Object.keys(state)
        .filter((prop) => !prop.endsWith('$'))
        .map((prop) => ({ [prop]: state[prop] }))
        .reduce((a, b) => Object.assign(b, a), {});
}
exports.removeTransients = removeTransients;
exports.epicDebugActions = (action$) => action$.pipe(operators_1.tap((action) => {
    console.log(action.type, action.id, action.state || action.changes || action.sceneId);
}), operators_1.switchMapTo(rxjs_1.empty()));
exports.epicEngineReflectChanges = (action$) => action$.pipe(redux_observable_1.ofType(common_1.systemInitSuccess.type, common_1.sceneInitSuccess.type, common_1.instanceInitSuccess.type, common_1.systemChangesSuccess.type, common_1.sceneChangesSuccess.type, common_1.instanceChangesSuccess.type, common_1.resourceInitSuccess.type), operators_1.bufferTime(self.intervalUpdate, rxjs_1.animationFrameScheduler), operators_1.filter((actions) => actions.length > 0), operators_1.tap((actions) => self.postMessage(common_1.engineReflectChanges({
    states: actions.map(({ id, state, changes }) => ({ id: id || state.id, state: changes || removeTransients(state) }))
}))), operators_1.switchMapTo(rxjs_1.empty()));
//# sourceMappingURL=epic.js.map