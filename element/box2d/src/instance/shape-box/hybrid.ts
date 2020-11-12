import { Hybrids } from 'hybrids';
import { Box2dElementShapeBox } from './element';
import { ogodFactoryInstanceProperty } from '@ogod/element-core';
import { box2dHybridShape } from '../shape/hybrid';

export function box2dHybridShapeBox(): Hybrids<Box2dElementShapeBox> {
    return {
        ...box2dHybridShape(),
        centerX: ogodFactoryInstanceProperty(0),
        centerY: ogodFactoryInstanceProperty(0),
        angle: ogodFactoryInstanceProperty(0)
    }
}
