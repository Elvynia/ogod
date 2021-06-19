import { ogodFactoryInstanceChildren, ogodFactoryInstanceProperty } from '@ogod/element-core';
import { Hybrids } from 'hybrids';
import { Box2dElementFixture } from './element';

export function box2dHybridFixture(): Hybrids<Box2dElementFixture> {
    return {
        category: 'fixture',
        density: ogodFactoryInstanceProperty(1),
        friction: ogodFactoryInstanceProperty(0),
        restitution: ogodFactoryInstanceProperty(0),
        shape: ogodFactoryInstanceChildren('shape')
    };
}
