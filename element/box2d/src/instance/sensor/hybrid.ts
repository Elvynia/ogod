import { ogodHybridPositionable, ogodHybridSizeable } from '@ogod/element-core';
import { Hybrids } from 'hybrids';
import { Box2dElementSensor } from './element';

export function box2dHybridSensor(): Hybrids<Box2dElementSensor> {
    return {
        category: 'sensor',
        ...ogodHybridPositionable(),
        ...ogodHybridSizeable()
    };
}
