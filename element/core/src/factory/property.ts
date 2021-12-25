import { property } from 'hybrids';
import { OgodActionCreator, sceneChanges, instanceChanges, systemChanges } from '@ogod/common';
import { ogodDispatchChildChanges } from './async';

export function ogodFactoryReactiveProperty(defaultValue: any, changesCreator: OgodActionCreator, connect?, observe?) {
    let engine, propName;
    return {
        ...property(defaultValue, (host: any, key: string, invalidate) => {
            const disconnect = connect && connect(host, key, invalidate);
            propName = key;
            host.state[propName] = host[key];
            engine = host.engine;
            return () => disconnect && disconnect();
        }),
        observe: (host, value, old) => {
            if (host.initialize$.isStopped) {
                if (value !== host.state[propName]) {
                    if (engine) {
                        // console.log('[%s] Observe %s detected changes from %s to %s with state=%s', host.id,
                        //     propName, old, value, host.state[propName]);
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
            } else {
                host.state[propName] = value;
            }
            observe && observe(host, value, old)
        }
    };
};

export const ogodFactorySceneProperty = (defaultValue, connect?, observe?) => ogodFactoryReactiveProperty(defaultValue, sceneChanges, connect, observe);
export const ogodFactoryInstanceProperty = (defaultValue, connect?, observe?) => ogodFactoryReactiveProperty(defaultValue, instanceChanges, connect, observe);
export const ogodFactorySystemProperty = (defaultValue, connect?, observe?) => ogodFactoryReactiveProperty(defaultValue, systemChanges, connect, observe);
