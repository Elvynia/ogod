import { ActionCreator } from "@ogod/common";

export function ogodFactoryReactiveBoolean(defaultValue: boolean, changesCreator: ActionCreator, connect?, observe?) {
    let propName;
    return {
        get: (host, value) => {
            return value;
        },
        set: (host, value, lastValue) => {
            host.state[propName] = value;
            return value;
        },
        connect: (host: HTMLElement, key: string, invalidate) => {
            propName = key;
            if (host.hasAttribute(key) && !defaultValue) {
                defaultValue = true;
            }
            host[key] = defaultValue;
            const observer = new MutationObserver((records) => {
                console.log(...records);
                if (host.hasAttribute(key) && !host[key]) {
                    host[key] = true;
                } else if (host[key]) {
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
            }
        },
        observe
    }
}

export const ogodFactorySceneBoolean = (defaultValue: boolean, connect?, observe?) => ogodFactoryReactiveBoolean(defaultValue, connect, observe);
export const ogodFactoryInstanceBoolean = (defaultValue: boolean, connect?, observe?) => ogodFactoryReactiveBoolean(defaultValue, connect, observe);
export const ogodFactorySystemBoolean = (defaultValue: boolean, connect?, observe?) => ogodFactoryReactiveBoolean(defaultValue, connect, observe);
