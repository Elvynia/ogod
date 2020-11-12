import { Hybrids } from 'hybrids';
import { ogodFactoryInstanceProperty, ogodFactoryInstanceChildren } from '@ogod/element-core';
import { Box2dElementBody } from './element';

export function box2dHybridBody(): Hybrids<Box2dElementBody> {
    return {
        category: 'body',
        x: ogodFactoryInstanceProperty(0),
        y: ogodFactoryInstanceProperty(0),
        dynamic: ogodFactoryInstanceProperty(false),
        density: ogodFactoryInstanceProperty(1),
        friction: ogodFactoryInstanceProperty(0),
        restitution: ogodFactoryInstanceProperty(0),
        shape: ogodFactoryInstanceChildren('shape')
    };
}
