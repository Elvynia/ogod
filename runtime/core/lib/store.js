"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ogodConfigureStore = void 0;
const redux_observable_1 = require("redux-observable");
const redux_1 = require("redux");
const epic_1 = require("./engine/epic");
function ogodConfigureStore(reducers, epics) {
    const epicMiddleware = redux_observable_1.createEpicMiddleware();
    const store = redux_1.createStore(redux_1.combineReducers(Object.assign({}, reducers)), {}, redux_1.applyMiddleware(epicMiddleware));
    store.asyncReducers = {};
    store.injectReducer = (key, asyncReducer) => {
        store.asyncReducers[key] = asyncReducer;
        store.replaceReducer(redux_1.combineReducers(Object.assign(Object.assign({}, reducers), store.asyncReducers)));
    };
    if (self.debugMode) {
        epicMiddleware.run(redux_observable_1.combineEpics(epic_1.epicDebugActions, ...epics));
    }
    else {
        epicMiddleware.run(redux_observable_1.combineEpics(...epics));
    }
    return store;
}
exports.ogodConfigureStore = ogodConfigureStore;
//# sourceMappingURL=store.js.map