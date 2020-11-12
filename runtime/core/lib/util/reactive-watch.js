"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.watchReactiveStates = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
function watchReactiveStates(category) {
    return self.update$.pipe(operators_1.withLatestFrom(self.state$.pipe(operators_1.pluck(category), operators_1.map((children) => Object.values(children).filter((child) => child.loaded)))), operators_1.map(([delta, children]) => children
        .filter((child) => child.active && !child.running || !child.active && child.running)
        .map((child) => ({ active: child.active, running: child.running, id: child.id }))), operators_1.filter((children) => children.length > 0), operators_1.mergeMap((children) => rxjs_1.from(children))).subscribe(({ active, running, id }) => {
        const runtime = self.runtimes[category][id];
        const state = self.store.getState()[category][id];
        if (active && !running) {
            runtime.start(state, self.state$);
        }
        else {
            runtime.stop(state);
        }
    });
}
exports.watchReactiveStates = watchReactiveStates;
//# sourceMappingURL=reactive-watch.js.map