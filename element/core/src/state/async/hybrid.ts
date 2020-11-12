import { Hybrids } from 'hybrids';
import { ogodFactoryInitialize$ } from "../../factory/initialize";
import { OgodElementAsync } from './element';

export function ogodHybridStateAsync<S>(connect?): Hybrids<OgodElementAsync<S>> {
    return {
        initialize$: ogodFactoryInitialize$(),
        state: {
            get: () => ({} as S),
            connect
        }
    };
}
