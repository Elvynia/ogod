import { ogodFactoryInstanceChildren, ogodFactoryInstanceProperty } from '@ogod/element-core';
import { threeHybridNearFar } from '../nearfar/hybrid';

export function threeHybridCamera() {
    return {
        category: 'camera',
        ...threeHybridNearFar(),
        fov: ogodFactoryInstanceProperty(45),
        ratio: ogodFactoryInstanceProperty(0),
        position: ogodFactoryInstanceChildren('vec3'),
        up: ogodFactoryInstanceChildren('vec3'),
        lookAt: ogodFactoryInstanceChildren('vec3')
    }
}
