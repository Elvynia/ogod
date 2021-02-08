import { ActionCreator, sceneChanges, instanceChanges, systemChanges } from "@ogod/common";
import { ogodFactoryReactiveProperty } from './property';

export const ogodFactoryReactiveArrayString = (defaultValue: Array<any>, changesCreator: ActionCreator, connect?, observe?) => ({
    ...ogodFactoryReactiveProperty('', changesCreator, (host, key, invalidate) => {
        const attrName = key.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
        if (host.hasAttribute(attrName)) {
            host[key] = host.getAttribute(attrName);
        }
        return connect && connect(host, key, invalidate);
    }, observe),
    get: (host, value) => value || defaultValue,
    set: (host, value) => {
        if (value != null && typeof value === 'string') {
            return value !== '' ? value.split(' ') : defaultValue;
        }
        return value;
    }
});

export const ogodFactoryReactiveArrayNumber = (defaultValue: Array<number>, changesCreator: ActionCreator, connect?, observe?) => ({
    ...ogodFactoryReactiveArrayString(defaultValue, changesCreator, connect, observe),
    set: (host, value) => {
        if (value != null && typeof value === 'string') {
            return value !== '' ? value.split(' ').map((val) => parseFloat(val)) : defaultValue;
        }
        return value;
    }
});

export const ogodFactorySceneArrayString = (defaultValue = [], connect?, observe?) => ogodFactoryReactiveArrayString(defaultValue, sceneChanges, connect, observe);
export const ogodFactoryInstanceArrayString = (defaultValue = [], connect?, observe?) => ogodFactoryReactiveArrayString(defaultValue, instanceChanges, connect, observe);
export const ogodFactorySystemArrayString = (defaultValue = [], connect?, observe?) => ogodFactoryReactiveArrayString(defaultValue, systemChanges, connect, observe);

export const ogodFactorySceneArrayNumber = (defaultValue = [], connect?, observe?) => ogodFactoryReactiveArrayNumber(defaultValue, sceneChanges, connect, observe);
export const ogodFactoryInstanceArrayNumber = (defaultValue = [], connect?, observe?) => ogodFactoryReactiveArrayNumber(defaultValue, instanceChanges, connect, observe);
export const ogodFactorySystemArrayNumber = (defaultValue = [], connect?, observe?) => ogodFactoryReactiveArrayNumber(defaultValue, systemChanges, connect, observe);
