"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ogodFactoryState = void 0;
function ogodFactoryState(defaultKeys, initCreator, destroyCreator) {
    return {
        get: (host, lastValue) => {
            if (!lastValue) {
                return {};
            }
            return lastValue;
        },
        set: (host, value, lastValue) => {
            if (lastValue !== undefined) {
                // console.log('%s change state', host.id, host.state, value, lastValue);
                Object.keys(value).filter((key) => defaultKeys.indexOf(key) < 0).forEach((key) => {
                    // console.log('   for %s state has %s and host has %s', key, value[key], host[key]);
                    if (value[key] !== host[key]) {
                        // console.log('   updating key %s with value %s', key, value[key])
                        host[key] = value[key];
                    }
                });
                return Object.assign(Object.assign({}, lastValue), value);
            }
            return value;
        },
        connect: (host, _, invalidate) => {
            for (const key of defaultKeys) {
                if (host[key] !== undefined) {
                    host.state[key] = host[key];
                }
            }
            const engine = host.engine;
            host.initialize$.subscribe({
                complete: () => engine.worker.postMessage(initCreator({
                    id: host.id,
                    state: host.state
                }))
            });
            const sub = host.state$.subscribe((state) => {
                Object.assign(host.state, state);
                Object.assign(host, state);
                invalidate();
            });
            return () => {
                engine.worker.postMessage(destroyCreator({
                    id: host.id
                }));
                sub.unsubscribe();
            };
        }
    };
}
exports.ogodFactoryState = ogodFactoryState;
//# sourceMappingURL=state.js.map