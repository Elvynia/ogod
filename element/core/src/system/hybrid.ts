import { Hybrids } from 'hybrids';
import { OgodElementSystem } from './element';
import { ogodFactorySystemProperty } from '../factory/property';
import { ogodFactorySystemArrayString } from '../factory/array';
import { ogodFactorySystemBoolean } from '../factory/boolean';

export function ogodHybridSystem(): Hybrids<OgodElementSystem> {
    return {
        mode: ogodFactorySystemProperty('any'),
        aspects: ogodFactorySystemArrayString(),
        acceptUnloaded: ogodFactorySystemBoolean(false)
    };
}
