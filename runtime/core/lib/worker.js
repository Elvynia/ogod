"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ogodWorkerStream = void 0;
const epics_1 = require("./epics");
const reducers_1 = require("./reducers");
const runtime_1 = require("./engine/runtime");
const rxjs_1 = require("rxjs");
const store_1 = require("./store");
exports.ogodWorkerStream = (registry, baseHref = '/', intervalUpdate = 1 / 60, reducers = reducers_1.ogodReducers, epics = epics_1.ogodEpics, runtimeEngine = runtime_1.ogodRuntimeEngineDefault) => {
    self.store = store_1.ogodConfigureStore(reducers, epics);
    self.state$ = new rxjs_1.BehaviorSubject(self.store.getState());
    new rxjs_1.Observable(function (observer) {
        observer.next(self.store.getState());
        const unsubscribe = self.store.subscribe(function () {
            observer.next(self.store.getState());
        });
        return unsubscribe;
    }).subscribe(self.state$);
    self.baseHref = baseHref;
    self.intervalUpdate = intervalUpdate;
    self.registry = registry;
    return runtimeEngine;
};
//# sourceMappingURL=worker.js.map