import { ogodFactoryInstanceProperty } from '@ogod/element-core';

export function threeHybridNearFar() {
    return {
        near: ogodFactoryInstanceProperty(1),
        far: ogodFactoryInstanceProperty(1000)
    }
}
