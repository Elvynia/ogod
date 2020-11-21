import { OgodElementCamera } from './element';
import { Hybrids } from 'hybrids';
import { ogodFactorySystemProperty } from '../../factory/property';
import { ogodFactoryInstanceChildren } from '../../factory/children';

export function ogodHybridCamera(): Hybrids<OgodElementCamera> {
    return {
        category: 'camera',
        x: ogodFactorySystemProperty(0),
        y: ogodFactorySystemProperty(0),
        width: ogodFactorySystemProperty(800),
        height: ogodFactorySystemProperty(600),
        worldX: ogodFactorySystemProperty(0),
        worldY: ogodFactorySystemProperty(0),
        offset: ogodFactoryInstanceChildren('area')
    };
}
