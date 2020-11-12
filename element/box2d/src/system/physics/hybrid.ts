import { Hybrids } from 'hybrids';
import { Box2dElementPhysics } from './element';
import { ogodFactorySystemProperty } from '@ogod/element-core';

export function box2dHybridPhysics(): Hybrids<Box2dElementPhysics> {
    return {
        gravityX: ogodFactorySystemProperty(0),
        gravityY: ogodFactorySystemProperty(0),
        modifier: ogodFactorySystemProperty(''),
        modifierX: ogodFactorySystemProperty(''),
        modifierY: ogodFactorySystemProperty('')
    };
}
