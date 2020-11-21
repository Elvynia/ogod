import { Hybrids } from 'hybrids';
import { ogodFactoryInstanceProperty } from '../../factory/property';
import { OgodElementTranslatable } from './element';

export function ogodHybridTranslatable(): Hybrids<OgodElementTranslatable> {
    return {
        tx: ogodFactoryInstanceProperty(0),
        ty: ogodFactoryInstanceProperty(0)
    }
}
