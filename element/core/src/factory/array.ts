import { ActionCreator, sceneChanges, instanceChanges, systemChanges } from "@ogod/common";
import { ogodFactoryReactiveProperty } from './property';

export const ogodFactoryReactiveArrayString = (defaultValue: Array<string>, changesCreator: ActionCreator, connect?, observe?) => ({
    ...ogodFactoryReactiveProperty('', changesCreator, (host, key, invalidate) => {
        const attrName = key.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
        if (host.hasAttribute(attrName)) {
            host[key] = host.getAttribute(attrName);
        }
        return connect && connect(host, key, invalidate);
    }, observe),
    get: (host, value) => {
        if (value == null) {
            return defaultValue;
        }
        return value;
    },
    set: (host, value, lastValue) => {
        if (value != null && typeof value === 'string') {
            return value !== '' ? value.split(' ') : defaultValue;
        }
        return value || defaultValue;
    }
});

export const ogodFactorySceneArrayString = (defaultValue = [], connect?, observe?) => ogodFactoryReactiveArrayString(defaultValue, sceneChanges, connect, observe);
export const ogodFactoryInstanceArrayString = (defaultValue = [], connect?, observe?) => ogodFactoryReactiveArrayString(defaultValue, instanceChanges, connect, observe);
export const ogodFactorySystemArrayString = (defaultValue = [], connect?, observe?) => ogodFactoryReactiveArrayString(defaultValue, systemChanges, connect, observe);
