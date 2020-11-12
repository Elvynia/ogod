"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ogodFactorySystemArrayString = exports.ogodFactoryInstanceArrayString = exports.ogodFactorySceneArrayString = exports.ogodFactoryReactiveArrayString = void 0;
const common_1 = require("@ogod/common");
const property_1 = require("./property");
exports.ogodFactoryReactiveArrayString = (defaultValue, changesCreator, connect, observe) => (Object.assign(Object.assign({}, property_1.ogodFactoryReactiveProperty('', changesCreator, (host, key, invalidate) => {
    const attrName = key.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
    if (host.hasAttribute(attrName)) {
        host[key] = host.getAttribute(attrName);
    }
    return connect && connect(host, key, invalidate);
}, observe)), { get: (host, value = defaultValue) => value, set: (host, value, lastValue) => {
        if (value != null && typeof value === 'string') {
            return value !== '' ? value.split(' ') : [];
        }
        return value || [];
    } }));
exports.ogodFactorySceneArrayString = (defaultValue = [], connect, observe) => exports.ogodFactoryReactiveArrayString(defaultValue, common_1.sceneChanges, connect, observe);
exports.ogodFactoryInstanceArrayString = (defaultValue = [], connect, observe) => exports.ogodFactoryReactiveArrayString(defaultValue, common_1.instanceChanges, connect, observe);
exports.ogodFactorySystemArrayString = (defaultValue = [], connect, observe) => exports.ogodFactoryReactiveArrayString(defaultValue, common_1.systemChanges, connect, observe);
//# sourceMappingURL=array.js.map