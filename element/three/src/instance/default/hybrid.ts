import { ogodFactoryInstanceChildren } from '@ogod/element-core';
import { Hybrids } from 'hybrids';
import { ThreeElementInstance } from './element';

export function threeHybridInstance(): Hybrids<ThreeElementInstance> {
    return {
        position: ogodFactoryInstanceChildren('vec3'),
        rotation: ogodFactoryInstanceChildren('vec3'),
        translator: ogodFactoryInstanceChildren('vec3'),
        rotator: ogodFactoryInstanceChildren('vec3'),
    }
}
