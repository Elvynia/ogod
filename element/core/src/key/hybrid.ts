import { OgodElementKey } from './element';
import { Hybrids } from 'hybrids';
import { ogodFactoryInstanceProperty } from '../factory/property';

export function ogodHybridKey(): Hybrids<OgodElementKey> {
    return {
        category: 'key',
        code: ogodFactoryInstanceProperty(''),
        keyCode: ogodFactoryInstanceProperty(-1),
        name: ogodFactoryInstanceProperty(''),
        pressed: ogodFactoryInstanceProperty(false)
    };
}
