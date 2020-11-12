import { Hybrids } from 'hybrids';
import { Box2dElementShape } from './element';
import { ogodFactoryInstanceProperty } from '@ogod/element-core';

export function box2dHybridShape(): Hybrids<Box2dElementShape> {
    return {
        category: 'shape',
        x: ogodFactoryInstanceProperty(0),
        y: ogodFactoryInstanceProperty(0)
    };
}
