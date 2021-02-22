import { ogodFactoryInstanceChildren, ogodFactoryInstanceProperty } from '@ogod/element-core';
import { threeHybridNearFar } from '../nearfar/hybrid';

export function threeHybridFog() {
    return {
        category: 'fog',
        ...threeHybridNearFar(),
        color: ogodFactoryInstanceProperty(0xffffff)
    }
}
