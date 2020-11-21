import { Hybrids } from 'hybrids';
import { OgodElementTranslate } from './element';
import { ogodFactorySystemProperty } from '../../factory/property';

export function ogodHybridTranslate(): Hybrids<OgodElementTranslate> {
    return {
        scale: ogodFactorySystemProperty(0),
        width: ogodFactorySystemProperty(0),
        height: ogodFactorySystemProperty(0),
        borderMode: ogodFactorySystemProperty('infinite')
    }
}
