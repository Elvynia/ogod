import { Hybrids } from 'hybrids';
import { PixiElementArea } from './element';
import { ogodFactorySystemProperty } from '@ogod/element-core';

export function pixiHybridArea(): Hybrids<PixiElementArea> {
    return {
        category: 'area',
        minX: ogodFactorySystemProperty(0),
        minY: ogodFactorySystemProperty(0),
        maxX: ogodFactorySystemProperty(1000),
        maxY: ogodFactorySystemProperty(1000)
    };
}
