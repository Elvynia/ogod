"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ogodFactoryInitialize$ = void 0;
const async_1 = require("./async");
const rxjs_1 = require("rxjs");
exports.ogodFactoryInitialize$ = () => ({
    get: () => new rxjs_1.BehaviorSubject({}),
    connect: (host, key, invalidate) => {
        host.initialize$.subscribe((state) => {
            if (Object.keys(state).length) {
                // console.log('%s has children waiting for loading:', host.id || host.category, state);
                host.initialize$.subscribe((as) => {
                    if (Object.entries(as)
                        .map(([k, v]) => v)
                        .reduce((a, b) => a && b, true)) {
                        host.initialize$.complete();
                    }
                });
                const listener = (e) => {
                    host.initialize$.next(Object.assign(Object.assign({}, host.initialize$.value), { [e.detail.referer]: true }));
                };
                host.addEventListener(async_1.OGOD_ASYNC_CHILD_READY, listener);
                return () => {
                    host.removeEventListener(async_1.OGOD_ASYNC_CHILD_READY, listener);
                };
            }
            else {
                // console.log('%s has no children', host.id || host.category);
                host.initialize$.complete();
            }
        });
    }
});
//# sourceMappingURL=initialize.js.map