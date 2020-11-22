import { ogodFactoryInstanceBoolean, ogodFactoryInstanceChildren } from '@ogod/element-core';
import { Hybrids } from 'hybrids';
import { Box2dElementInstanceJump } from './element';

export function box2dHybridInstanceJump(): Hybrids<Box2dElementInstanceJump> {
    return {
        jumpSensor: ogodFactoryInstanceChildren('sensor'),
        jumping: ogodFactoryInstanceBoolean(false),
        grounded: ogodFactoryInstanceBoolean(false)
    };
}
