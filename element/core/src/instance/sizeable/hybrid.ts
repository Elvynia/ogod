import { Hybrids } from 'hybrids';
import { ogodFactoryInstanceProperty } from '../../factory/property';
import { OgodElementSizeable } from './element';

export function ogodHybridSizeable(): Hybrids<OgodElementSizeable> {
    return {
        width: ogodFactoryInstanceProperty(0),
        height: ogodFactoryInstanceProperty(0)
    }
}
