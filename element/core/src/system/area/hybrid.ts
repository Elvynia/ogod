import { Hybrids } from 'hybrids';
import { OgodElementArea } from './element';
import { ogodFactorySystemProperty } from '../../factory/property';

export function ogodHybridArea(): Hybrids<OgodElementArea> {
    return {
        category: 'area',
        minX: ogodFactorySystemProperty(0),
        minY: ogodFactorySystemProperty(0),
        maxX: ogodFactorySystemProperty(1000),
        maxY: ogodFactorySystemProperty(1000)
    };
}
