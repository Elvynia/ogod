import { Hybrids } from 'hybrids';
import { ogodFactoryInstanceProperty } from '../../factory/property';
import { OgodElementPositionable } from './element';

export function ogodHybridPositionable(): Hybrids<OgodElementPositionable> {
    return {
        x: ogodFactoryInstanceProperty(0),
        y: ogodFactoryInstanceProperty(0)
    }
}
