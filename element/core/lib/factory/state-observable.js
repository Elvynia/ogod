"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ogodFactoryState$ = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
function ogodFactoryState$() {
    return {
        get: () => new rxjs_1.Subject(),
        connect: (host) => {
            const engine = host.engine;
            const state$ = rxjs_1.merge(engine.state$, engine.update$).pipe(operators_1.filter((action) => action.id === host.id), operators_1.pluck('state'));
            state$.subscribe(host.state$);
        }
    };
}
exports.ogodFactoryState$ = ogodFactoryState$;
//# sourceMappingURL=state-observable.js.map