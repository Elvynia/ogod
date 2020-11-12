"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ogodFactorySystemBoolean = exports.ogodFactoryInstanceBoolean = exports.ogodFactorySceneBoolean = exports.ogodFactoryReactiveBoolean = void 0;
function ogodFactoryReactiveBoolean(defaultValue, changesCreator, connect, observe) {
    let propName;
    return {
        get: (host, value) => {
            return value;
        },
        set: (host, value, lastValue) => {
            host.state[propName] = value;
            return value;
        },
        connect: (host, key, invalidate) => {
            propName = key;
            if (host.hasAttribute(key) && !defaultValue) {
                defaultValue = true;
            }
            host[key] = defaultValue;
            const observer = new MutationObserver((records) => {
                console.log(...records);
                if (host.hasAttribute(key) && !host[key]) {
                    host[key] = true;
                }
                else if (host[key]) {
                    host[key] = false;
                }
            });
            observer.observe(host, {
                attributes: true,
                attributeFilter: [key]
            });
            const disconnect = connect && connect(host, key, invalidate);
            return () => {
                observer.disconnect();
                if (disconnect) {
                    disconnect();
                }
            };
        },
        observe
    };
}
exports.ogodFactoryReactiveBoolean = ogodFactoryReactiveBoolean;
exports.ogodFactorySceneBoolean = (defaultValue, connect, observe) => ogodFactoryReactiveBoolean(defaultValue, connect, observe);
exports.ogodFactoryInstanceBoolean = (defaultValue, connect, observe) => ogodFactoryReactiveBoolean(defaultValue, connect, observe);
exports.ogodFactorySystemBoolean = (defaultValue, connect, observe) => ogodFactoryReactiveBoolean(defaultValue, connect, observe);
//# sourceMappingURL=boolean.js.map