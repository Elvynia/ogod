import { Hybrids } from 'hybrids';
import { Box2dElementShapeCircle } from './element';
import { ogodFactoryInstanceProperty } from '@ogod/element-core';
import { box2dHybridShape } from '../shape/hybrid';

export function box2dHybridShapeCircle(): Hybrids<Box2dElementShapeCircle> {
    return {
        ...box2dHybridShape(),
        radius: ogodFactoryInstanceProperty(1),
        angle: ogodFactoryInstanceProperty(0)
    }
}
