import { Hybrids } from 'hybrids';
import { Box2dElementJump } from './element';
import { ogodFactorySystemProperty } from '@ogod/element-core';

export function box2dHybridJump(): Hybrids<Box2dElementJump> {
    return {
        force: ogodFactorySystemProperty(1),
        physicsId: ogodFactorySystemProperty('')
    };
}
