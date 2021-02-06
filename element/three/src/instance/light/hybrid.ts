import { ogodFactoryInstanceProperty } from '@ogod/element-core';
import { Hybrids } from 'hybrids';
import { ThreeElementLight } from './element';

export function threeHybridLight(): Hybrids<ThreeElementLight> {
    return {
        color: ogodFactoryInstanceProperty(0xffffff),
        intensity: ogodFactoryInstanceProperty(1)
    }
}
