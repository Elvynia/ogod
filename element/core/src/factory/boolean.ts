import { property } from 'hybrids';
import { ActionCreator, sceneChanges, instanceChanges, systemChanges } from "@ogod/common";
import { ogodDispatchChildChanges } from "./async";

// FIXME: add attribute support for init, maybe also changes.
export function ogodFactoryReactiveBoolean(defaultValue: boolean, changesCreator: ActionCreator, connect?, observe?) {
    let engine, propName;
    return {
        ...property(defaultValue, (host: any, key: string, invalidate) => {
            if (connect) {
                connect(host, key, invalidate);
            }
            propName = key;
            host.state[propName] = host[key];
            engine = host.engine;
        }),
        observe: (host, value, old) => {
            // console.log('[%s] Observe %s detected changes from %s to %s with state=%s', host.id, propName, old, value, host.state[propName]);
            if (value !== host.state[propName]) {
                if (engine) {
                    engine.worker.postMessage(changesCreator({
                        id: host.id,
                        changes: {
                            [propName]: value
                        }
                    }));
                } else {
                    // console.log('child value changed from %s to %s', host.state[propName], value);
                    host.state[propName] = value;
                    ogodDispatchChildChanges(host, host.category, host.key);
                }
            }
            observe && observe(host, value, old)
        }
    };
}

export const ogodFactorySceneBoolean = (defaultValue: boolean, connect?, observe?) => ogodFactoryReactiveBoolean(defaultValue, sceneChanges, connect, observe);
export const ogodFactoryInstanceBoolean = (defaultValue: boolean, connect?, observe?) => ogodFactoryReactiveBoolean(defaultValue, instanceChanges, connect, observe);
export const ogodFactorySystemBoolean = (defaultValue: boolean, connect?, observe?) => ogodFactoryReactiveBoolean(defaultValue, systemChanges, connect, observe);
