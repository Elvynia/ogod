import { DisposeFunction, Drivers } from '@ogod/game-core';

export function gameRun<D extends Drivers<SO, SI>, SO, SI extends Record<keyof SO, any>>
    (main: (sources: SO) => SI, drivers: D): DisposeFunction {
    if (typeof drivers !== `object` || drivers === null) {
        throw new Error(
            `Argument given to setupReusable must be an object ` +
            `with driver functions as properties.`
        );
    }
    if (Object.keys(drivers).length === 0) {
        throw new Error(
            `Argument given to setupReusable must be an object ` +
            `with at least one driver function declared as a property.`
        );
    }
    const sources: any = {};
    const promises: any = {};
    for (const key in drivers) {
        sources[key] = drivers[key](new Promise((resolve, reject) => promises[key] = { resolve, reject }));
    }
    const sinks = main(sources);
    for (const key in sinks) {
        if (sinks[key]) {
            promises[key].resolve(sinks[key]);
        } else {
            promises[key].reject('Main call did not return sink observable for driver %s', key);
        }
    }
    return () => Object.values(sources)
        .filter((s: any) => s.dispose)
        .forEach((s: any) => s.dispose());
}
