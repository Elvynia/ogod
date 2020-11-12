"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ogodReactiveUpdate = void 0;
const operators_1 = require("rxjs/operators");
function ogodReactiveUpdate(runtime, state) {
    let source = self.update$.asObservable();
    let sub;
    if (state.tick) {
        source = source.pipe(operators_1.tap((delta) => runtime.update(delta, state)));
    }
    if (state.updates.length > 0 || state.reflects.length > 0) {
        source = source.pipe(operators_1.map((delta) => [delta, state.updates.concat(state.reflects.filter((i) => !state.updates.includes(i)))
                .reduce((acc, key) => Object.assign(acc, { [key]: state[key] }), {})]));
        if (state.updates.length > 0) {
            source = source.pipe(operators_1.scan((s1, [delta, s2]) => {
                state.updates
                    .filter((up) => s1[up] !== s2[up])
                    .forEach((up) => {
                    const upFn = 'updateState' + up[0].toUpperCase() + (up.length > 1 ? up.substring(1) : '');
                    if (runtime[upFn]) {
                        runtime[upFn](delta, state);
                    }
                });
                return s2;
            }, Object.assign({}, state)));
        }
        else {
            source = source.pipe(operators_1.map(([_, s]) => s));
        }
        if (state.reflects.length > 0) {
            sub = source.pipe(operators_1.scan(([s1], s2) => {
                const changes = state.reflects
                    .filter((ref) => s1[ref] !== s2[ref])
                    .map((ref) => ({ [ref]: s2[ref] }))
                    .reduce((acc, prop) => Object.assign(acc, prop), {});
                return [s2, changes];
            }, [Object.assign({}, state), {}]), operators_1.map(([s, changes]) => changes)).subscribe((update) => self.reflect$.next({ id: state.id, state: update }));
        }
    }
    if (!sub) {
        sub = source.subscribe();
    }
    return sub;
}
exports.ogodReactiveUpdate = ogodReactiveUpdate;
//# sourceMappingURL=reactive-update.js.map