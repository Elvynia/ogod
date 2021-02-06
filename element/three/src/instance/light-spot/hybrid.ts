import { ogodFactoryInstanceBoolean, ogodFactoryInstanceProperty } from '@ogod/element-core';
import { Hybrids } from 'hybrids';
import { ThreeElementLightSpot } from './element';

export function threeHybridLightSpot(): Hybrids<ThreeElementLightSpot> {
    return {
        angle: ogodFactoryInstanceProperty(1),
        penumbra: ogodFactoryInstanceProperty(0),
        helper: ogodFactoryInstanceBoolean(false)
    }
}
