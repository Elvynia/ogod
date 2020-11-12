"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ogodFactorySystemProperty = exports.ogodFactoryInstanceProperty = exports.ogodFactorySceneProperty = exports.ogodFactoryReactiveProperty = void 0;
const hybrids_1 = require("hybrids");
const common_1 = require("@ogod/common");
const async_1 = require("./async");
function ogodFactoryReactiveProperty(defaultValue, changesCreator, connect, observe) {
    let engine, propName;
    return Object.assign(Object.assign({}, hybrids_1.property(defaultValue, (host, key, invalidate) => {
        if (connect) {
            connect(host, key, invalidate);
        }
        propName = key;
        host.state[propName] = host[key];
        engine = host.engine;
    })), { observe: (host, value, old) => {
            // console.log('[%s] Observe %s detected changes from %s to %s with state=%s', host.id, propName, old, value, host.state[propName]);
            if (value !== host.state[propName]) {
                if (engine) {
                    engine.worker.postMessage(changesCreator({
                        id: host.id,
                        changes: {
                            [propName]: value
                        }
                    }));
                }
                else {
                    // console.log('child value changed from %s to %s', host.state[propName], value);
                    host.state[propName] = value;
                    async_1.ogodDispatchChildChanges(host, host.category);
                }
            }
            observe && observe(host, value, old);
        } });
}
exports.ogodFactoryReactiveProperty = ogodFactoryReactiveProperty;
;
exports.ogodFactorySceneProperty = (defaultValue, connect, observe) => ogodFactoryReactiveProperty(defaultValue, common_1.sceneChanges, connect, observe);
exports.ogodFactoryInstanceProperty = (defaultValue, connect, observe) => ogodFactoryReactiveProperty(defaultValue, common_1.instanceChanges, connect, observe);
exports.ogodFactorySystemProperty = (defaultValue, connect, observe) => ogodFactoryReactiveProperty(defaultValue, common_1.systemChanges, connect, observe);
//# sourceMappingURL=property.js.map