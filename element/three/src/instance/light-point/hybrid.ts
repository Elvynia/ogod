import { ogodFactoryInstanceBoolean, ogodFactoryInstanceProperty } from '@ogod/element-core';
import { Hybrids } from 'hybrids';
import { ThreeElementLightPoint } from './element';

export function threeHybridLightPoint(): Hybrids<ThreeElementLightPoint> {
    return {
        distance: ogodFactoryInstanceProperty(1),
        decay: ogodFactoryInstanceProperty(1),
        helper: ogodFactoryInstanceBoolean(false)
    }
}
