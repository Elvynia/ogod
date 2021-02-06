import { Hybrids, property } from 'hybrids';
import { ogodFactoryInitialize$ } from "../../factory/initialize";
import { OgodElementAsync } from './element';

export function ogodHybridStateAsync<S>(connect?): Hybrids<OgodElementAsync<S>> {
    return {
        key: property('', (host) => {
            if (!host.key) {
                host.key = host.category;
            }
        }),
        initialize$: ogodFactoryInitialize$(),
        state: {
            get: () => ({} as S),
            connect
        }
    };
}
