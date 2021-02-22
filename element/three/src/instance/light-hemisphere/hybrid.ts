import { ogodFactoryInstanceProperty } from '@ogod/element-core';
import { Hybrids } from 'hybrids';
import { threeHybridLight } from '../light/hybrid';
import { ThreeElementLightHemisphere } from './element';

export function threeHybridLightHemisphere(): Hybrids<ThreeElementLightHemisphere> {
    return {
        ...threeHybridLight(),
        groundColor: ogodFactoryInstanceProperty(0xffffff)
    }
}
