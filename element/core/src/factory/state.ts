import { filter } from 'rxjs/operators';
import { OgodActionCreator, OgodStateActor, OgodCategoryState } from "@ogod/common";
import { from } from "rxjs";

export function ogodFactoryState<
    S extends OgodStateActor<C>,
    C extends string = S['category']
>(defaultKeys: string[], initCreator: OgodActionCreator, destroyCreator: OgodActionCreator) {
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
                return {
                    ...lastValue,
                    ...value
                };
            }
            return value;
        },
        connect: (host) => {
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
            const sub = host.state$.subscribe((state: S) => {
                // console.log('UPDATE OR CHANGES: ', state)
                Object.assign(host.state, state);
                from(Object.keys(state)).pipe(
                    filter((key) => Object.getOwnPropertyDescriptor(host.__proto__, key)?.set != null)
                ).subscribe((key) => host[key] = state[key]);
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
